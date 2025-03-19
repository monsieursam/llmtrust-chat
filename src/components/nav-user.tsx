"use client"

import {
  LogIn
} from "lucide-react"

import { SignOutButton, useUser, SignInButton, UserProfile, UserButton } from "@clerk/nextjs"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser() {
  const { user } = useUser()

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SignInButton>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start gap-2"
            >
              <LogIn className="size-4" />
              Sign In
            </SidebarMenuButton>
          </SignInButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                <AvatarFallback className="rounded-lg">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar> */}
          <UserButton appearance={{
            elements: {
              userButtonPopoverCard: {
                pointerEvents: 'initial'
              }
            }
          }} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.fullName}</span>
            <span className="truncate text-xs">{user.primaryEmailAddress?.emailAddress}</span>
          </div>
        </SidebarMenuButton>
        {/* <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          > */}
        {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                  <AvatarFallback className="rounded-lg">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.fullName}</span>
                  <span className="truncate text-xs">{user.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
              <DropdownMenuItem>

                <BadgeCheck />
                Account
              </DropdownMenuItem> */}
        {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
        {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
        {/* </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
              <SignOutButton>
                <DropdownMenuItem>
                  <LogOut />
                  Sign Out
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
