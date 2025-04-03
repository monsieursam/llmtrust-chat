"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Fragment } from "react"
import { useAuth } from "@clerk/nextjs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { WalletButtonContainer } from "@/components/wallet-button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  const pathname = usePathname()
  const user = useAuth()
  const { isSignedIn } = user

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    if (paths.length === 0) return []
    paths.pop();

    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      return {
        href,
        label: path.charAt(0).toUpperCase() + path.slice(1),
      }
    })
  }

  const breadcrumbs = getBreadcrumbs()

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

            {breadcrumbs.map((breadcrumb) => (
              <Fragment key={breadcrumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {breadcrumb.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-2">
        {isSignedIn && (
          <WalletButtonContainer />
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
