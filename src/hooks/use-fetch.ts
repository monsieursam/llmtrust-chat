import { useAuth } from "@clerk/nextjs"

export default function useFetch() {
  const { getToken } = useAuth()

  const authenticatedFetch = async (input: string | URL | globalThis.Request,
    init?: RequestInit | undefined) => {
    const token = await getToken()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
      ...init,
      headers: {
        ...init?.headers, 'Authorization': `Bearer ${token}` || ''
      }
    })

    return response;
  }

  return authenticatedFetch
}
