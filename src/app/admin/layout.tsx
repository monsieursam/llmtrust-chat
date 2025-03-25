import "../globals.css";
import AdminNav from "./_components/admin-nav";
import { checkRole } from '@/lib/roles';
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}:
  {
    children: React.ReactNode
  }
) {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={'antialiased min-h-screen'}
      >
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background border-r">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
              <div className="px-4 pb-2">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="px-4 py-4">
                <AdminNav />
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="flex flex-col flex-1 md:pl-64">
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
