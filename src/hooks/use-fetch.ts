import fetchApi from "@/lib/fetch"
import { useAuth } from "@clerk/nextjs"

export default async function useFetch() {
  // Use `useAuth()` to access the `getToken()` method
  const { getToken } = useAuth()

  // Use `getToken()` to get the current session token
  const token = await getToken()

  const authenticatedFetch = async (input: string | URL | globalThis.Request,
    init?: RequestInit | undefined) => {
    return fetchApi(input, {
      headers: { Authorization: `Bearer ${token}`, ...init?.headers }, // Include the session token as a Bearer token in the Authorization header
    }).then((res) => res.json())
  }

  return authenticatedFetch
}
