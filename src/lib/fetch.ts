import { auth } from "@clerk/nextjs/server";

export default async function fetchApi(input: string | URL | globalThis.Request,
  init?: RequestInit | undefined) {
  const { getToken } = await auth()
  const token = await getToken()

  const response = await fetch(`${process.env.API_URL}${input}`, {
    ...init,
    headers: {
      ...init?.headers, 'Authorization': `Bearer ${token}` || ''
    }
  })

  return response;
}
