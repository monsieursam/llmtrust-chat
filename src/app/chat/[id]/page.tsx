
import { getMessages } from '@/app/actions/messages';
import ChatInterface from '@/components/client/chat-interface';

export default async function Chat({ params }: { params: { id: string } }) {
  const { id } = await params;
  const messages = await getMessages(id);

  return <ChatInterface messages={messages} />

}
