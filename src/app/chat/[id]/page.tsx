
import ChatInterface from './_components/chat-interface';

type Params = Promise<{ id: string }>;

export default async function Chat({ params }: { params: Params }) {

  return <ChatInterface />

}
