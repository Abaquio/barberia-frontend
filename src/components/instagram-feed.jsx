"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

export default function InstagramFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  // helper para resolver imágenes respetando BASE_URL (Vite/GitHub Pages)
  const img = (src) =>
    typeof src === "string" ? (src.startsWith("/") ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src) : src

  // Posts de muestra para el feed de Instagram
  const instagramPosts = [
    {
      id: 1,
      image: "/classic-barber-haircut-with-scissors.png",
      likes: 245,
      caption: "Corte clásico perfecto ✂️ #BarberLife #ClassicCut",
      date: "2 días",
    },
    {
      id: 2,
      image: "/premium-hot-towel-shave-with-straight-razor.png",
      likes: 189,
      caption: "Afeitado tradicional con navaja 🪒 #TraditionalShave",
      date: "3 días",
    },
    {
      id: 3,
      image: "/modern-barber-shop-interior-with-vintage-chairs-an.png",
      likes: 312,
      caption: "Nuestro espacio, tu estilo 💈 #BarberShop #Style",
      date: "5 días",
    },
    {
      id: 4,
      image: "/professional-barber-carlos-with-classic-style.png",
      likes: 156,
      caption: "Carlos en acción 👨‍💼 #TeamWork #Professional",
      date: "1 semana",
    },
    {
      id: 5,
      image: "/modern-barber-miguel-with-trendy-haircut.png",
      likes: 203,
      caption: "Miguel creando arte ✨ #ArtOfCutting",
      date: "1 semana",
    },
    {
      id: 6,
      image: "/experienced-barber-roberto-with-traditional-tools.png",
      likes: 278,
      caption: "Roberto y su experiencia 🎯 #MasterBarber",
      date: "2 semanas",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, instagramPosts.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, instagramPosts.length - 2)) % Math.max(1, instagramPosts.length - 2),
    )
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">SÍGUENOS EN</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-accent mb-6">INSTAGRAM</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre nuestros trabajos más recientes y mantente al día con las últimas tendencias
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-accent font-semibold text-lg">@barberia_elite</span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-accent/90 hover:bg-accent text-background p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-accent/90 hover:bg-accent text-background p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden rounded-lg">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              }}
            >
              {instagramPosts.map((post) => (
                <div key={post.id} className="w-1/3 flex-shrink-0 px-3">
                  <Card className="group cursor-pointer overflow-hidden bg-card border-border hover:border-accent/50 transition-all duration-300 hover:scale-105">
                    <div className="relative overflow-hidden">
                      <img
                        src={img(post.image) || `${import.meta.env.BASE_URL}placeholder.svg`}
                        alt={`Instagram post ${post.id}`}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Overlay con información */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <span className="font-semibold">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="font-semibold">{Math.floor(post.likes * 0.3)}</span>
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <p className="text-sm font-medium">Ver en Instagram</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Caption y fecha */}
                    <div className="p-4">
                      <p className="text-foreground text-sm mb-2 line-clamp-2">{post.caption}</p>
                      <p className="text-muted-foreground text-xs">hace {post.date}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.max(1, instagramPosts.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-accent scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            Seguir en Instagram
          </button>
        </div>
      </div>
    </section>
  )
}