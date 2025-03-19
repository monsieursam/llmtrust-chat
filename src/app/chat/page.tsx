'use client'

import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import { createConversation } from '@/actions/conversations'
import { useConversations } from '@/hooks/use-conversations'

// This page will create a new conversation and redirect to it
export default function Home() {
  const router = useRouter()
  const { createConversation, createConversationData } = useConversations()

  useEffect(() => {
    // Create a new conversation in the database and redirect to it
    const createNewConversation = async () => {
      try {
        await createConversation({ title: 'new conversation' });

      } catch (error) {
        console.error('Error creating new conversation:', error)
      }
    }

    createNewConversation()
  }, [])

  useEffect(() => {
    if (createConversationData) {
      router.push(`/chat/${createConversationData.id}`)
    }
  }, [createConversationData])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Creating new conversation...</p>
    </div>
  )
}
