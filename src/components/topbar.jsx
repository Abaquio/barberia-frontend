"use client"

import { useState, useEffect } from "react"
import { Instagram, MessageCircle, User } from "lucide-react"

export default function Topbar({ onAdminClick }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 100) setIsVisible(true)
      else setIsVisible(y < lastScrollY)
      setLastScrollY(y)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastScrollY])

  // Avisar al Hero para que haga ScrollTrigger.refresh() y no haya “saltos”
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("topbar:visibility", { detail: isVisible }))
  }, [isVisible])


  return (
    <div
      id="topbar"
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        pointer-events-none`}             
      style={{ paddingTop: "env(safe-area-inset-top)" }}  // iOS notch safe-area
    >

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Íconos izquierda */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <a
            href="https://instagram.com/barberia_elite"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors group"
            aria-label="Instagram"
          >
            <div className="p-2 rounded-full border-2 border-muted-foreground/70 group-hover:border-transparent group-hover:bg-accent/90 transition-all">
              <Instagram className="h-4 w-4 group-hover:text-accent-foreground" />
            </div>
          </a>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-green-500 transition-colors group"
            aria-label="WhatsApp"
          >
            <div className="p-2 rounded-full border-2 border-muted-foreground/70 group-hover:border-green-500 group-hover:bg-green-500/90 transition-all">
              <MessageCircle className="h-4 w-4 group-hover:text-white" />
            </div>
          </a>
        </div>

        {/* Ícono admin derecha */}
        <button
          onClick={onAdminClick}
          className="pointer-events-auto text-muted-foreground hover:text-accent transition-colors group"
          aria-label="Admin"
        >
          <div className="p-2 rounded-full border-2 border-muted-foreground/70 group-hover:border-accent group-hover:bg-accent/20 transition-all">
            <User className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  )
}
