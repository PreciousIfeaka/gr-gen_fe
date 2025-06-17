"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { QrCode } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MovieQR
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              asChild
              className={pathname === "/" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Link href="/">
                <QrCode className="h-4 w-4 mr-2" />
                QR Generator
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
