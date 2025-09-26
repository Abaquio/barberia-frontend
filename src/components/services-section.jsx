"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: "Corte Clásico",
    price: "$25",
    description: "Corte tradicional con tijeras y navaja, acabado perfecto",
    image: "/classic-barber-haircut-with-scissors.png",
  },
  {
    title: "Afeitado Premium",
    price: "$35",
    description: "Afeitado con navaja caliente, toallas aromáticas y masaje facial",
    image: "/premium-hot-towel-shave-with-straight-razor.png",
  },
  {
    title: "Barba & Bigote",
    price: "$20",
    description: "Diseño y mantenimiento de barba con productos premium",
    image: "/beard-trimming-and-styling-with-premium-products.png",
  },
  {
    title: "Paquete Completo",
    price: "$60",
    description: "Corte + Afeitado + Arreglo de barba. La experiencia completa",
    image: "/complete-barber-package-service.png",
  },
]

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

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
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Cards stagger animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            },
          )

          // Hover effect
          card.addEventListener("mouseenter", () => {
            gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" })
          })

          card.addEventListener("mouseleave", () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" })
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-5xl md:text-6xl font-black text-center text-chart-5 mb-16">
          NUESTROS
          <span className="block text-primary">SERVICIOS</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="bg-background border-border hover:border-accent transition-colors duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-2xl font-bold text-accent">{service.price}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
