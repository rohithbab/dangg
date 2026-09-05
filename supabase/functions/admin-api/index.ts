/**
 * admin-api — the ONLY place the service_role key is allowed to exist.
 *
 * WHY THIS EXISTS
 * `entrypoint.sh` used to write the service_role key into a public config.js,
 * so anyone could read https://admin.dangg.app/config.js and get full read/write
 * on the production database (service_role bypasses RLS). This function keeps
 * that key server-side and exposes a fixed, auditable set of operations.
 *
 * DESIGN: allow-list, not a passthrough.
 * The client sends an operation NAME, never a table name or a filter string.
 * A generic "run this query for me" proxy would just relocate the original
 * vulnerability. Every operation below is written out in full here, so the
 * blast radius of a compromised admin session is exactly this list.
 *
 * Deploy:
 *   supabase functions deploy admin-api
 *
 * Required secrets:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (server-side only)
 *   ADMIN_JWT_SECRET                          (same value as admin-login)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ADMIN_ORIGIN') ?? 'https://admin.dangg.app',
  'Access-Control-Allow-Headers': 'content-type, authorization, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const db = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

/* Small helpers so an op that fails loudly cannot be mistaken for empty data. */
const must = <T>(r: { data: T; error: unknown }) => {
  if (r.error) throw new Error(String((r.error as { message?: string })?.message ?? r.error));
  return r.data;
};
const countOf = async (q: PromiseLike<{ count: number | null; error: unknown }>) => {
  const r = await q;
  if (r.error) throw new Error(String((r.error as { message?: string })?.message ?? r.error));
  return r.count ?? 0;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const assertUuid = (v: unknown, name: string): string => {
  const s = String(v ?? '');
  if (!UUID.test(s)) throw new Error(`Invalid ${name}`);
  return s;
};

/* ── Operation allow-list ─────────────────────────────────────────────────
   Enum values here are the ones VERIFIED against production 2026-09-05:
     chat_session_status = active | ended        (NOT 'completed')
     payout_status       = pending | approved | completed | rejected
                         | failed | cancelled    (NOT 'processing')
   payout_details has NO FK to payouts — it is joined on female_id in JS. */
const OPS: Record<string, (p: Record<string, unknown>) => Promise<unknown>> = {

  async analytics() {
    const [totalUsers, maleUsers, femaleUsers, totalChats, endedChats, totalMessages] =
      await Promise.all([
        countOf(db.from('users').select('*', { count: 'exact', head: true })),
        countOf(db.from('users').select('*', { count: 'exact', head: true }).eq('role', 'male')),
        countOf(db.from('users').select('*', { count: 'exact', head: true }).eq('role', 'female')),
        countOf(db.from('chat_sessions').select('*', { count: 'exact', head: true })),
        countOf(db.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'ended')),
        countOf(db.from('chat_messages').select('*', { count: 'exact', head: true })),
      ]);
    const payments = must(await db.from('payments').select('amount_paisa').eq('status', 'captured'));
    const pending = must(
      await db.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'approved']),
    );
    return {
      totalUsers, maleUsers, femaleUsers, totalChats,
      completedChats: endedChats, totalMessages,
      totalRevenuePaisa: (payments as { amount_paisa: number }[])
        .reduce((s, p) => s + (p.amount_paisa || 0), 0),
      pendingPayoutsPaisa: (pending as { payout_amount_paisa: number }[])
        .reduce((s, p) => s + (p.payout_amount_paisa || 0), 0),
    };
  },

  async revenue() {
    const [captured, completed, pending, females] = await Promise.all([
      db.from('payments').select('amount_paisa').eq('status', 'captured'),
      db.from('payouts').select('payout_amount_paisa').eq('status', 'completed'),
      db.from('payouts').select('payout_amount_paisa').in('status', ['pending', 'approved']),
      db.from('females').select('earnings_balance_coins').gt('earnings_balance_coins', 0),
    ]);
    const femaleCount = await countOf(
      db.from('females').select('*', { count: 'exact', head: true }).gt('earnings_balance_coins', 0),
    );
    const sum = (rows: unknown, k: string) =>
      ((rows ?? []) as Record<string, number>[]).reduce((s, r) => s + (r[k] || 0), 0);

    const totalRevenuePaisa = sum(must(captured), 'amount_paisa');
    const completedPayoutsPaisa = sum(must(completed), 'payout_amount_paisa');
    const totalFemaleCoins = sum(must(females), 'earnings_balance_coins');
    return {
      totalRevenuePaisa,
      completedPayoutsPaisa,
      pendingPayoutsPaisa: sum(must(pending), 'payout_amount_paisa'),
      actualProfitPaisa: totalRevenuePaisa - completedPayoutsPaisa,
      totalFemaleCoins,
      // 1 earning-coin = ₹0.04 (10 paisa × 40% female share)
      totalFemaleBalanceRupees: Math.floor(totalFemaleCoins * 4) / 100,
      femaleCount,
    };
  },

  async users() {
    return must(await db.from('users').select(`
      id, name, phone, role, age, is_active, is_suspended, profile_picture_url, created_at,
      males (coin_balance, chats_initiated),
      females (verification_status, is_online)
    `).order('created_at', { ascending: false }));
  },

  async payouts() {
    const rows = must(await db.from('payouts').select(`
      id, status, payout_amount_paisa, coins_requested, female_id, requested_at, utr_number,
      users!inner (name, profile_picture_url)
    `).order('requested_at', { ascending: false })) as Record<string, unknown>[];
    if (rows.length === 0) return [];
    const ids = [...new Set(rows.map((r) => r.female_id).filter(Boolean))];
    const details = must(
      await db.from('payout_details').select('female_id, upi_id, account_number, method').in('female_id', ids),
    ) as Record<string, unknown>[];
    const byFemale = new Map(details.map((d) => [d.female_id, d]));
    return rows.map((r) => ({ ...r, payout_details: byFemale.get(r.female_id) ?? null }));
  },

  async pendingVerifications() {
    const rows = must(await db.from('females').select(`
      id, verification_status, verification_submitted_at, verification_photo_path,
      users!inner (name, phone, profile_picture_url)
    `).eq('verification_status', 'pending')
      .order('verification_submitted_at', { ascending: true })) as Record<string, unknown>[];

    return Promise.all(rows.map(async (f) => {
      let signed: string | null = null;
      if (f.verification_photo_path) {
        const path = String(f.verification_photo_path).replace(/^verification\//, '');
        const { data } = await db.storage.from('verification').createSignedUrl(path, 3600);
        signed = data?.signedUrl ?? null;
      }
      return { ...f, signedPhotoUrl: signed };
    }));
  },

  async chatStats() {
    const c = (t: string, s?: string) => {
      let q = db.from(t).select('*', { count: 'exact', head: true });
      if (s) q = q.eq('status', s);
      return countOf(q);
    };
    const [totalRequests, accepted, declined, cancelled, expired, active, ended, messages] =
      await Promise.all([
        c('chat_requests'), c('chat_requests', 'accepted'), c('chat_requests', 'declined'),
        c('chat_requests', 'cancelled'), c('chat_requests', 'expired'),
        c('chat_sessions', 'active'), c('chat_sessions', 'ended'), c('chat_messages'),
      ]);
    const durations = must(
      await db.from('chat_sessions').select('started_at, ended_at')
        .eq('status', 'ended').not('ended_at', 'is', null),
    ) as { started_at: string; ended_at: string }[];
    return { totalRequests, accepted, declined, cancelled, expired,
             activeSessions: active, completedSessions: ended, totalMessages: messages, durations };
  },

  async chatSessions() {
    return must(await db.from('chat_sessions').select(`
      id, status, started_at, ended_at, male_id, female_id,
      male_user:users!male_id (name, profile_picture_url),
      female_user:users!female_id (name, profile_picture_url)
    `).order('started_at', { ascending: false }).limit(100));
  },

  async chatReplay(p) {
    const id = assertUuid(p.sessionId, 'sessionId');
    const session = must(await db.from('chat_sessions').select(`
      id, status, started_at, ended_at, male_id, female_id,
      male_user:users!male_id (name, profile_picture_url),
      female_user:users!female_id (name, profile_picture_url)
    `).eq('id', id).single());
    /* Ordered by sent_at (not created_at) to match the original query — the
       two are equal today but sent_at is the semantically correct field. */
    const messages = must(await db.from('chat_messages')
      .select('id, sender_id, body, message_type, media_url, sent_at')
      .eq('chat_session_id', id).order('sent_at', { ascending: true }));
    return { session, messages };
  },

  async userProfile(p) {
    const id = assertUuid(p.userId, 'userId');
    const role = p.role === 'female' ? 'female' : 'male';
    const child = role === 'female'
      ? `females!inner (verification_status, verification_photo_path, is_online,
                        earnings_balance_coins, rating_avg, total_chats, total_ratings, coin_price)`
      : `males!inner (coin_balance, total_coins_purchased, total_coins_spent, chats_initiated)`;

    const user = must(await db.from('users')
      .select(`id, name, phone, age, created_at, profile_picture_url, ${child}`)
      .eq('id', id).eq('role', role).single());

    if (role === 'male') {
      /* payments links to the male via male_id (NOT user_id). */
      const [payments, chats] = await Promise.all([
        db.from('payments')
          .select('id, amount_paisa, coins_to_credit, status, created_at')
          .eq('male_id', id).eq('status', 'captured')
          .order('created_at', { ascending: false }).limit(10),
        db.from('chat_sessions')
          .select('id, status, started_at, ended_at')
          .eq('male_id', id).order('started_at', { ascending: false }).limit(5),
      ]);
      return { user, payments: must(payments) ?? [], chats: must(chats) ?? [] };
    }
    const [payouts, detail] = await Promise.all([
      db.from('payouts').select('id, status, payout_amount_paisa, requested_at, utr_number')
        .eq('female_id', id).order('requested_at', { ascending: false }).limit(10),
      db.from('payout_details').select('upi_id, method').eq('female_id', id).maybeSingle(),
    ]);
    const d = detail.data ?? null;
    return { user, payouts: ((must(payouts) ?? []) as Record<string, unknown>[])
      .map((r) => ({ ...r, payout_details: d })) };
  },

  async verificationPhotoUrl(p) {
    const id = assertUuid(p.femaleId, 'femaleId');
    const row = must(await db.from('females')
      .select('verification_photo_path').eq('id', id).single()) as { verification_photo_path: string | null };
    if (!row?.verification_photo_path) return { url: null };
    const path = row.verification_photo_path.replace(/^verification\//, '');
    const { data } = await db.storage.from('verification').createSignedUrl(path, 300);
    return { url: data?.signedUrl ?? null };
  },

  /* ── Mutations ─────────────────────────────────────────────────────────
     Each is narrow and guarded by the expected current status, so a replayed
     or racing request cannot move a row through an invalid transition. */

  async approveVerification(p) {
    const id = assertUuid(p.femaleId, 'femaleId');
    must(await db.from('females')
      .update({ verification_status: 'verified', verification_decided_at: new Date().toISOString() })
      .eq('id', id).eq('verification_status', 'pending'));
    return { ok: true };
  },

  async rejectVerification(p) {
    const id = assertUuid(p.femaleId, 'femaleId');
    const reason = String(p.reason ?? '').slice(0, 500) || null;
    must(await db.from('females').update({
      verification_status: 'rejected',
      verification_decided_at: new Date().toISOString(),
      verification_rejection_reason: reason,
    }).eq('id', id).eq('verification_status', 'pending'));
    return { ok: true };
  },

  async approvePayout(p) {
    const id = assertUuid(p.payoutId, 'payoutId');
    must(await db.from('payouts')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id).eq('status', 'pending'));
    return { ok: true };
  },

  async completePayout(p) {
    const id = assertUuid(p.payoutId, 'payoutId');
    const utr = String(p.utr ?? '').trim();
    if (!/^[A-Za-z0-9-]{6,32}$/.test(utr)) throw new Error('Invalid UTR number');
    must(await db.from('payouts')
      .update({ status: 'completed', completed_at: new Date().toISOString(), utr_number: utr })
      .eq('id', id).eq('status', 'approved'));
    return { ok: true };
  },

  async rejectPayout(p) {
    const id = assertUuid(p.payoutId, 'payoutId');
    const femaleId = assertUuid(p.femaleId, 'femaleId');
    const coins = Number(p.coinsRequested);
    if (!Number.isFinite(coins) || coins <= 0) throw new Error('Invalid coin amount');
    const reason = String(p.reason ?? '').slice(0, 500);

    /* Refund FIRST. If the RPC fails we must not flip the status, or the
       creator's coins vanish. */
    const refund = await db.rpc('credit_female_earnings', {
      p_female_id: femaleId,
      p_amount: coins,
      p_type: 'payout_failed_reversal',
      p_reference_id: id,
      p_description: reason ? `Payout rejected: ${reason}` : 'Payout rejected by admin',
    });
    if (refund.error) throw new Error(`Refund failed: ${refund.error.message}`);

    must(await db.from('payouts').update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: reason || null,
    }).eq('id', id).eq('status', 'pending'));
    return { ok: true };
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const SECRET = Deno.env.get('ADMIN_JWT_SECRET');
  if (!SECRET) {
    console.error('admin-api: ADMIN_JWT_SECRET not set');
    return json({ error: 'Server not configured' }, 500);
  }

  /* ── Verify the admin session token ────────────────────────────────── */
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'Unauthorized' }, 401);

  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'],
    );
    const payload = await verify(token, key); // throws on bad signature or expiry
    if (payload.role !== 'dangg_admin') return json({ error: 'Forbidden' }, 403);
  } catch {
    return json({ error: 'Invalid or expired session' }, 401);
  }

  let op = '';
  let params: Record<string, unknown> = {};
  try {
    const body = await req.json();
    op = String(body?.op ?? '');
    params = (body?.params ?? {}) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const handler = Object.prototype.hasOwnProperty.call(OPS, op) ? OPS[op] : undefined;
  if (!handler) return json({ error: 'Unknown operation' }, 400);

  try {
    return json({ data: await handler(params) });
  } catch (e) {
    /* Log the detail server-side; return something safe to the client so
       Postgres internals are never echoed to the browser. */
    console.error(`admin-api op=${op}:`, e);
    const msg = e instanceof Error ? e.message : 'Request failed';
    const safe = /^Invalid |^Refund failed/.test(msg) ? msg : 'Request failed';
    return json({ error: safe }, 400);
  }
});
