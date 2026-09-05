#!/usr/bin/env node
/**
 * Produces the SHA-256 hex hash that admin-login compares against.
 *
 *   node scripts/hash-password.mjs 'your-password'
 *
 * Store ONLY the hash (as ADMIN_PASSWORD_HASH). The plaintext should never be
 * committed, logged, or placed in any environment variable.
 *
 * Note: this is a plain SHA-256, not a slow KDF like bcrypt/argon2. That is an
 * accepted trade-off for a single shared admin credential that is also rate
 * limited server-side — but it means the password itself must be long and
 * random. If this ever becomes multi-user, move to a real KDF.
 */
import { createHash } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs 'your-password'");
  process.exit(1);
}

if (password.length < 16) {
  console.error(
    `Refusing: password is ${password.length} characters.\n` +
    'Because this is a fast hash, use at least 16 characters of high entropy.\n' +
    'Generate one with:  openssl rand -base64 24',
  );
  process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');

console.log('\nADMIN_PASSWORD_HASH=' + hash);
console.log('\nSet it with:');
console.log(`  supabase secrets set ADMIN_PASSWORD_HASH='${hash}'`);
console.log('\nDo not store the plaintext password anywhere.\n');
