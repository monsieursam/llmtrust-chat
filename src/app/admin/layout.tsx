import "../globals.css";

export default function AdminLayout({
  children,
}:
  {
    children: React.ReactNode
  }
) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={'antialiased min-h-screen flex flex-col'}
      >
        {children}
      </body>
    </html>
  )
}
