'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useConversations } from '@/hooks/use-conversations'

// This page will create a new conversation and redirect to it
export default function Home() {
  const router = useRouter()
  const { createConversation, createConversationData } = useConversations()

  useEffect(() => {
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
      console.log('createConversationData', createConversationData)
      // router.push(`/chat/${createConversationData.id}`)
    }
  }, [createConversationData, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Creating new conversation...</p>
    </div>
  )
}
