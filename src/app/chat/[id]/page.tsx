
import { getMessages } from '@/actions/messages';
import ChatInterface from './_components/chat-interface';

type Params = Promise<{ id: string }>;

export default async function Chat({ params }: { params: Params }) {
  const { id } = await params;
  const messages = await getMessages(id);

  return <ChatInterface messages={messages} />

}
