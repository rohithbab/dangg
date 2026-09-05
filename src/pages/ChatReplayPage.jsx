import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatDateSeparator } from '../components/ui/ChatDateSeparator';
import { ChatMessageBubble } from '../components/ui/ChatMessageBubble';
import { ChatReplayFooter } from '../components/ui/ChatReplayFooter';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { supabase } from '../lib/supabase';

const PLACEHOLDER_AVATAR = 'https://placehold.co/40x40/e2e8f0/64748b?text=U';

function fetchSessionReplay(chatId) {
  return async function fetchSessionReplayQuery() {
    const [sessionResult, messagesResult] = await Promise.all([
      supabase
        .from('chat_sessions')
        .select(`
          id, status, started_at, ended_at, male_id, female_id,
          male_user:users!male_id (name, profile_picture_url),
          female_user:users!female_id (name, profile_picture_url)
        `)
        .eq('id', chatId)
        .single(),

      supabase
        .from('chat_messages')
        .select('id, sender_id, body, message_type, media_url, sent_at')
        .eq('chat_session_id', chatId)
        .order('sent_at', { ascending: true }),
    ])

    if (sessionResult.error) throw sessionResult.error

    return {
      session: sessionResult.data,
      messages: messagesResult.data || [],
    }
  }
}

function groupMessagesByDay(messages) {
  const groups = []
  let currentDay = null

  for (const msg of messages) {
    const d = new Date(msg.sent_at)
    const dayKey = d.toDateString()
    if (dayKey !== currentDay) {
      currentDay = dayKey
      groups.push({ type: 'separator', label: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }), key: dayKey })
    }
    groups.push({ type: 'message', ...msg })
  }

  return groups
}

function formatTime(sentAt) {
  return new Date(sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

/* How long the session ran. Returns null for a session still open or missing
   timestamps, so the caller can omit the field rather than print "NaN". */
function formatDuration(startedAt, endedAt) {
  if (!startedAt || !endedAt) return null
  const ms = new Date(endedAt) - new Date(startedAt)
  if (!Number.isFinite(ms) || ms <= 0) return null
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function ChatReplayPage() {
  const { chatId } = useParams()
  const scrollRef = useRef(null)
  const { data, loading, error } = useAdminQuery(fetchSessionReplay(chatId), [chatId])

  useEffect(() => {
    if (scrollRef.current && !loading) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [loading])

  if (loading) {
    return (
      <PageContainer flush>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-primary" />
        </div>
      </PageContainer>
    )
  }

  if (error || !data?.session) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-card rounded-xl p-8 max-w-md mx-auto space-y-6 shadow-card">
          <div className="w-16 h-16 bg-critical/10 text-critical rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="text-xl font-black text-ink">Session Not Found</h3>
          <p className="text-sm text-ink-2">This chat session could not be loaded.</p>
          <Link to="/transcript" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-white" />
            Back to Transcripts
          </Link>
        </div>
      </PageContainer>
    )
  }

  const { session, messages } = data
  const maleAvatar = session.male_user?.profile_picture_url || PLACEHOLDER_AVATAR
  const femaleAvatar = session.female_user?.profile_picture_url || PLACEHOLDER_AVATAR
  const items = groupMessagesByDay(messages)
  const duration = formatDuration(session.started_at, session.ended_at)

  return (
    <PageContainer flush>
      <div className="chat-replay-layout">
        {/* Who, how long, and how many messages. The page previously identified
            the conversation only by a raw UUID in the top bar, so an admin
            reading a transcript could not tell whose it was. */}
        <header className="chat-status-banner">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-3 gap-y-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <img src={femaleAvatar} alt="" className="chat-message-avatar" />
              <img src={maleAvatar} alt="" className="chat-message-avatar -ml-4" />
              <span className="min-w-0 truncate font-semibold text-ink">
                {session.female_user?.name || 'Unknown'}
                <span className="px-1.5 text-ink-3">↔</span>
                {session.male_user?.name || 'Unknown'}
              </span>
            </div>
            <span className="chat-status-pill">{session.status}</span>
            <span className="text-ink-3">·</span>
            <span>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</span>
            {duration && (
              <>
                <span className="text-ink-3">·</span>
                <span>{duration}</span>
              </>
            )}
          </div>
        </header>

        <div ref={scrollRef} className="chat-replay-scroll">
          <div className="chat-replay-thread">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <MaterialIcon name="chat_bubble_outline" className="!text-[48px] text-ink-2/30" />
              <p className="text-ink-2 font-medium">No messages in this session.</p>
            </div>
          ) : (
            items.map((item) => {
              if (item.type === 'separator') {
                return <ChatDateSeparator key={item.key} label={item.label} />
              }
              const isFemale = item.sender_id === session.female_id
              const isImage = item.message_type === 'image'
              const isVideo = item.message_type === 'video'
              return (
                <ChatMessageBubble
                  key={item.id}
                  avatarUrl={isFemale ? femaleAvatar : maleAvatar}
                  time={formatTime(item.sent_at)}
                  outgoing={isFemale}
                  message={(!isImage && !isVideo) ? item.body : undefined}
                  imageUrl={isImage ? item.media_url : undefined}
                  imageCaption={isImage && item.body ? item.body : undefined}
                  videoUrl={isVideo ? item.media_url : undefined}
                  videoCaption={isVideo && item.body ? item.body : undefined}
                />
              )
            })
          )}
          </div>
        </div>

        <ChatReplayFooter />
      </div>
    </PageContainer>
  )
}
