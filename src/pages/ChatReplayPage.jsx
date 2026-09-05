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
        .select('id, sender_id, body, sent_at')
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        </div>
      </PageContainer>
    )
  }

  if (error || !data?.session) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-surface rounded-xl p-8 max-w-md mx-auto space-y-6 shadow-card">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="text-xl font-black text-on-surface">Session Not Found</h3>
          <p className="text-sm text-on-surface-variant">This chat session could not be loaded.</p>
          <Link to="/transcript" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-on-primary" />
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

  return (
    <PageContainer flush>
      <div className="chat-replay-layout">
        <div ref={scrollRef} className="chat-replay-scroll">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <MaterialIcon name="chat_bubble_outline" className="!text-[48px] text-on-surface-variant/30" />
              <p className="text-on-surface-variant font-medium">No messages in this session.</p>
            </div>
          ) : (
            items.map((item) => {
              if (item.type === 'separator') {
                return <ChatDateSeparator key={item.key} label={item.label} />
              }
              const isFemale = item.sender_id === session.female_id
              return (
                <ChatMessageBubble
                  key={item.id}
                  avatarUrl={isFemale ? femaleAvatar : maleAvatar}
                  message={item.body}
                  time={formatTime(item.sent_at)}
                  outgoing={isFemale}
                />
              )
            })
          )}
        </div>

        <ChatReplayFooter />
      </div>
    </PageContainer>
  )
}
