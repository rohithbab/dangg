import { useEffect, useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatDateSeparator } from '../components/ui/ChatDateSeparator';
import { ChatMessageBubble } from '../components/ui/ChatMessageBubble';
import { ChatStatusBanner } from '../components/ui/ChatStatusBanner';
import { ChatReplayFooter } from '../components/ui/ChatReplayFooter';

const USER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAOEmvT3L-7C3oNDB_zhNbIzRyvJP26h76UhK3uVai0dJwpkjjEEgZHJV5H0QlUzeyFfUi6w5PvKwRafp-Ktqx6WdazzHzjA0cuhwtdMrb7LFZnifGJve1D8OlORYBoJ9d6p6-5mfmyzKmpw9Y2emB3uFH62iOfqs_u2Tqyag7iRDJHqa93e3-gVAqQA625w-7mwh6eJC3dan_VE6vYc40sosH0uFFY2NRIAhPV0OWGFl76Opyw3hJUMrpZmfAay91h8b1Y53WPb3I';

const AGENT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD-jrA3i9nII5Cun9H-2Z5d9cqwCk-RS_KHTntrPOYXMAV6_UH6TEUVn7ElATppsAFZXyfvDD4mW3S8ytRL87rFUOardfB7tV9xjJ9qT2x6XZUjsd0ps-pEtfRlaoYDPO8D1uvzVecYYv-GoViHlVebJgPKRDmW0DneLPDrIvA3iWBEnLqyES2jhtAb9Q9FCWlXQVtG9ebed4IOE9tc8C3tnBGMsou15fBMH_UfCoZ7sCTNKkEp0DKAgrCKiK1bQN_yL71moXaJYhM';

const RECEIPT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBakAI3sEUXUnOX42xoaXmc2JpxveyAiVP1QFmAFvaPdY6_quHbM4W3NTtxOR7h6RyMtNmRxK-ay2uWWqklIks8fQRsscDVwNIZHJF16xZO-O7rBgIPM-TsX-acS2jljyN9-MToDi9OEclCSDr7VA6mZIKhNl7gJA9dZZV0Zaj462wEjOTTJKKR38XM7MnBJc65X7OPmQAlSLoK-H6zjLM_CO9vUgdRy1uP1_FrMaG9kQs5iwiN5mm_F2uCzzyQiGarCwbTTJLc74';

const MESSAGES = [
  {
    id: '1',
    avatarUrl: USER_AVATAR,
    message:
      "Hello! I'm having an issue with my recent subscription renewal. It seems I was charged twice for the Professional Plan.",
    time: '09:41 AM',
    outgoing: false,
  },
  {
    id: '2',
    avatarUrl: AGENT_AVATAR,
    message:
      'Hello, Mr. Henderson. I can certainly help you with that! Let me pull up your transaction records right now. Could you please confirm the last 4 digits of the card used?',
    time: '09:42 AM',
    outgoing: true,
  },
  {
    id: '3',
    avatarUrl: USER_AVATAR,
    imageCaption: 'Sure, here is a screenshot of the banking notification I received this morning.',
    imageUrl: RECEIPT_IMAGE,
    time: '09:43 AM',
    outgoing: false,
  },
];

const AGENT_FOLLOW_UP = [
  {
    id: '4',
    message:
      "I've located the duplicate entry. It appears there was a latency spike in the payment gateway during your first attempt. I have initiated a refund for the second transaction.",
  },
  {
    id: '5',
    message:
      'The funds should appear back in your account within 3-5 business days. Is there anything else I can assist you with today?',
  },
];

export function ChatReplayPage() {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <PageContainer flush>
      <div className="chat-replay-layout">
        <div ref={scrollRef} className="chat-replay-scroll">
          <ChatDateSeparator label="Monday, October 24" />

          {MESSAGES.map((msg) => (
            <ChatMessageBubble key={msg.id} {...msg} />
          ))}

          <ChatStatusBanner message="Agent Sarah is verifying the transaction..." />

          <div className="chat-message-row chat-message-row-outgoing max-w-[70%] self-end">
            <img src={AGENT_AVATAR} alt="" className="chat-message-avatar" />
            <div className="flex flex-col items-end space-y-1">
              {AGENT_FOLLOW_UP.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-outgoing ${index > 0 ? 'mt-2' : ''}`}
                >
                  <p className="type-body-md normal-case text-on-sidebar font-medium">{msg.message}</p>
                </div>
              ))}
              <span className="chat-bubble-time chat-bubble-time-outgoing">09:45 AM</span>
            </div>
          </div>

          <ChatMessageBubble
            avatarUrl={USER_AVATAR}
            message="That was very fast, thank you Sarah! That's all for now."
            time="09:46 AM"
            outgoing={false}
          />
        </div>

        <ChatReplayFooter />
      </div>
    </PageContainer>
  );
}
