'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useConversations } from '@/hooks/use-conversations'

// This page will create a new conversation and redirect to it
export default function NewChatPage() {
  const router = useRouter()
  const { createConversation } = useConversations()

  useEffect(() => {
    // Create a new conversation in the database and redirect to it
    const createNewConversation = async () => {
      try {
        // Create a new conversation with a temporary title
        // The title will be updated when the user sends their first message
        createConversation({ title: 'New Conversation' }, {
          onSuccess: (newConversation) => {
            router.push(`/chat/${newConversation.id}`)
          },
        })
      } catch (error) {
        console.error('Error creating new conversation:', error)
        // Handle error (e.g., show toast notification)
        router.push('/') // Redirect to home on error
      }
    }

    createNewConversation()
  }, [router, createConversation])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Creating new conversation...</p>
    </div>
  )
}
