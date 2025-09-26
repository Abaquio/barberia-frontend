"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for image
      gsap.to(imageRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Text reveal animation
      gsap.fromTo(
        textRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Stats counter animation
      const statNumbers = statsRef.current?.querySelectorAll(".stat-number")
      statNumbers?.forEach((stat) => {
        const finalValue = Number.parseInt(stat.textContent || "0")
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: finalValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={imageRef} className="relative">
            <img
              src={`${import.meta.env.BASE_URL}/experienced-barber-working-with-vintage-tools-and-.png`}
              alt="Master Barber"
              className="w-full h-[600px] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-lg" />
          </div>

          <div ref={textRef} className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6">
                MAESTRÍA
                <span className="block text-accent">& TRADICIÓN</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Con más de 15 años de experiencia, combinamos técnicas tradicionales con las últimas tendencias para
                ofrecerte un servicio excepcional.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cada corte es una obra de arte, cada cliente es único. Nos especializamos en crear looks que reflejen tu
                personalidad y estilo de vida.
              </p>
            </div>

            <div ref={statsRef} className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-accent stat-number">15</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Años Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent stat-number">5000</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent stat-number">100</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">% Calidad</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
