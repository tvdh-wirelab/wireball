import type React from "react"
import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css" // Ensure global styles are imported

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="flex flex-1 flex-col lg:pl-0">
            {" "}
            {/* Adjust padding for sidebar width */}
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
