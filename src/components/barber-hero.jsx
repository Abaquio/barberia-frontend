"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"

gsap.registerPlugin(ScrollTrigger)

export default function BarberHero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const imageWrapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], { y: 0, opacity: 1 })

      // Entrada
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(titleRef.current,    { y: 100, opacity: 0, duration: 1.0 })
        .from(subtitleRef.current, { y:  50, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(buttonRef.current,   { y:  30, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(imageWrapRef.current,{ scale: 1.2, opacity: 0, duration: 1.2 }, 0.1)

      // Scroll (fade + movimiento con retorno)
      gsap.fromTo(titleRef.current, { y: 0, opacity: 1 }, {
        y: -30, opacity: 0.25, overwrite: "auto", immediateRender: false,
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
      })
      gsap.fromTo(subtitleRef.current, { y: 0, opacity: 1 }, {
        y: -10, opacity: 0.35, overwrite: "auto", immediateRender: false,
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
      })
      gsap.fromTo(buttonRef.current, { y: 0 }, {
        y: -8, overwrite: "auto", immediateRender: false,
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
      })
      gsap.to(imageWrapRef.current, {
        scale: 1.08, y: -80, overwrite: "auto",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
      })

      // Refresh si cambia la visibilidad del Topbar
      const onTopbarToggle = () => ScrollTrigger.refresh()
      document.addEventListener("topbar:visibility", onTopbarToggle)

      // Refresh al cargar la imagen
      const imgEl = imageWrapRef.current?.querySelector("img")
      if (imgEl) imgEl.addEventListener("load", () => ScrollTrigger.refresh())

      return () => {
        document.removeEventListener("topbar:visibility", onTopbarToggle)
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])



const goBarberos = () => {
  document.getElementById("barberos")?.scrollIntoView({ block: "start", behavior: "smooth" })
}


  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* ✅ Overlay SIN franja arriba */}
      <div
        className="
          absolute inset-0 z-[1]
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_22%,rgba(0,0,0,0.65)_60%,rgba(0,0,0,0.75)_100%)]
        "
      />

      {/* Imagen de fondo */}
      <div ref={imageWrapRef} className="absolute inset-0 z-0">
        <img
          src="/modern-barber-shop-interior-with-vintage-chairs-an.png"
          alt="Modern Barber Shop"
          className="w-full h-full object-cover opacity-60"
          loading="eager"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
          ELITE
          <span className="block text-accent">BARBER</span>
        </h1>

        <p ref={subtitleRef} className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
          Donde el estilo clásico se encuentra con la precisión moderna. Experimenta el arte del barbering de clase mundial.
        </p>

        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4 justify-center">

        </div>
      </div>

      {/* Indicador scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
