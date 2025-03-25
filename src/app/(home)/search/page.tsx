import { Suspense } from 'react'
import SearchInterface from './_components/search-interface'


export default function SearchPage() {
  return (
    <Suspense>
      <SearchInterface />
    </Suspense>
  )
}
