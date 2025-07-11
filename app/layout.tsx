import type React from "react"
import { cookies } from "next/headers"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
              <SidebarTrigger className="lg:hidden" /> {/* Show trigger only on mobile */}
              <h1 className="text-lg font-semibold">WireBall Cost Estimator</h1>
            </header>
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
