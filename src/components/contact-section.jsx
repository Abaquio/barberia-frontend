"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])
  const mapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.2,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          )
        }
      })

      // Map animation
      gsap.fromTo(
        mapRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-5xl md:text-6xl font-black text-center text-foreground mb-16">
          VISÍTANOS
          <span className="block text-chart-5">HOY</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card
            ref={(el) => {
              if (el) cardsRef.current[0] = el
            }}
            className="bg-background border-border text-center p-8"
          >
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Ubicación</h3>
              <p className="text-muted-foreground">
                Av. Principal 123
                <br />
                Centro, Ciudad
                <br />
                CP 12345
              </p>
            </CardContent>
          </Card>

          <Card
            ref={(el) => {
              if (el) cardsRef.current[1] = el
            }}
            className="bg-background border-border text-center p-8"
          >
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Horarios</h3>
              <p className="text-muted-foreground">
                Lun - Vie: 9:00 - 20:00
                <br />
                Sábado: 9:00 - 18:00
                <br />
                Domingo: Cerrado
              </p>
            </CardContent>
          </Card>

          <Card
            ref={(el) => {
              if (el) cardsRef.current[2] = el
            }}
            className="bg-background border-border text-center p-8"
          >
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Contacto</h3>
              <p className="text-muted-foreground">
                +52 555 123 4567
                <br />
                info@elitebarbershop.com
                <br />
                @elitebarbershop
              </p>
            </CardContent>
          </Card>
        </div>

        <div ref={mapRef} className="relative h-96 bg-muted rounded-lg overflow-hidden">
          <img
            src="/modern-barber-shop-location-map-with-golden-pin-ma.png"
            alt="Ubicación Elite Barber Shop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Ver en Google Maps
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
