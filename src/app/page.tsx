'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createConversation } from './actions/conversations'
import { useAuth } from '@clerk/nextjs'

// This page will create a new conversation and redirect to it
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Create a new conversation in the database and redirect to it
    const createNewConversation = async () => {
      try {
        // Create a new conversation with a temporary title
        // The title will be updated when the user sends their first message
        const conversation = await createConversation();
        // Redirect to the new conversation
        router.push(`/chat/${conversation.id}`)
      } catch (error) {
        console.error('Error creating new conversation:', error)
        // Handle error (e.g., show toast notification)
        router.push('/') // Redirect to home on error
      }
    }

    createNewConversation()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Creating new conversation...</p>
    </div>
  )
}
