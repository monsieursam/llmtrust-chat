"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useAuth } from "@clerk/nextjs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { WalletButton } from "@/components/wallet-button"

export function Header() {
  const user = useAuth()
  const { isSignedIn } = user

  return (
    <header className="w-full h-14 flex items-center px-4">
      <div className="flex flex-1 items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <SidebarTrigger />
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-2">
        {isSignedIn && (
          <WalletButton />
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
