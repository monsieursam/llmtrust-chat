'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useConversations } from '@/hooks/use-conversations'

// This page will create a new conversation and redirect to it
export default function Home() {
  const router = useRouter()
  const { createConversation } = useConversations()

  useEffect(() => {
    const createNewConversation = async () => {
      try {
        const data = await createConversation({ title: 'new conversation' });

        router.push(`/chat/${data?.id}`) // redirect t

      } catch (error) {
        console.error('Error creating new conversation:', error)
      }
    }

    createNewConversation()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Creating new conversation...</p>
    </div>
  )
}
