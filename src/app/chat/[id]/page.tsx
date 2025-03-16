
import { getMessages } from '@/app/actions/messages';
import ChatInterface from '@/components/client/chat-interface';

type Params = Promise<{ id: string }>;

export default async function Chat({ params }: { params: Params }) {
  const { id } = await params;
  const messages = await getMessages(id);

  return <ChatInterface messages={messages} />

}
