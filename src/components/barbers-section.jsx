"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Helper para resolver rutas de imágenes con el base de Vite/GitHub Pages
const img = (src) =>
  typeof src === "string"
    ? (src.startsWith("/") ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src)
    : src

const barbers = [
  {
    id: 1,
    name: "Carlos Mendez",
    avatar: "/professional-barber-carlos-with-classic-style.png",
    services: [
      {
        name: "Corte Clásico",
        price: "$25",
        description: "Corte tradicional con tijeras y navaja, acabado perfecto",
        image: "/classic-barber-haircut-with-scissors.png",
      },
      {
        name: "Afeitado Premium",
        price: "$35",
        description: "Afeitado con navaja caliente, toallas aromáticas y masaje facial",
        image: "/premium-hot-towel-shave-with-straight-razor.png",
      },
      {
        name: "Barba & Bigote",
        price: "$20",
        description: "Diseño y mantenimiento de barba con productos premium",
        image: "/classic-barber-haircut-with-scissors.png",
      },
      {
        name: "Paquete Completo",
        price: "$60",
        description: "Corte + Afeitado + Arreglo de barba. La experiencia completa",
        image: "/modern-barber-shop-interior-with-vintage-chairs-an.png",
      },
    ],
  },
  {
    id: 2,
    name: "Miguel Torres",
    avatar: "/modern-barber-miguel-with-trendy-haircut.png",
    services: [
      {
        name: "Corte Moderno",
        price: "$30",
        description: "Estilos contemporáneos con técnicas avanzadas",
        image: "/classic-barber-haircut-with-scissors.png",
      },
      {
        name: "Fade Profesional",
        price: "$28",
        description: "Degradados perfectos con máquina y tijera",
        image: "/premium-hot-towel-shave-with-straight-razor.png",
      },
      {
        name: "Diseño de Barba",
        price: "$22",
        description: "Perfilado y diseño personalizado de barba",
        image: "/classic-barber-haircut-with-scissors.png",
      },
      {
        name: "Tratamiento Capilar",
        price: "$45",
        description: "Lavado + Corte + Tratamiento nutritivo",
        image: "/modern-barber-shop-interior-with-vintage-chairs-an.png",
      },
    ],
  },
  {
    id: 3,
    name: "Roberto Silva",
    avatar: "/experienced-barber-roberto-with-traditional-tools.png",
    services: [
      {
        name: "Afeitado Tradicional",
        price: "$40",
        description: "Técnica clásica con navaja de afeitar tradicional",
        image: "/premium-hot-towel-shave-with-straight-razor.png",
      },
      {
        name: "Corte & Afeitado",
        price: "$55",
        description: "Servicio completo de corte y afeitado profesional",
        image: "/classic-barber-haircut-with-scissors.png",
      },
      {
        name: "Masaje Facial",
        price: "$25",
        description: "Relajante masaje facial con productos naturales",
        image: "/premium-hot-towel-shave-with-straight-razor.png",
      },
      {
        name: "Experiencia VIP",
        price: "$80",
        description: "Servicio premium completo con atención personalizada",
        image: "/modern-barber-shop-interior-with-vintage-chairs-an.png",
      },
    ],
  },
]

export default function BarbersSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const servicesRef = useRef([])
  const [selectedBarber, setSelectedBarber] = useState(barbers[0])
  const [isVisible, setIsVisible] = useState(false)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber)
  }

  const handleReservation = (service) => {
    setSelectedService({ ...service, barber: selectedBarber.name })
    setShowReservationForm(true)
  }

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-background" id="barberos">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className={`text-5xl md:text-6xl font-black text-center mb-16 tracking-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-foreground">NUESTROS</span>
          <br />
          <span className="text-accent">SERVICIOS</span>
        </h2>

        <div className="flex justify-center mb-12">
          <div className="flex space-x-8">
            {barbers.map((barber) => (
              <button
                key={barber.id}
                onClick={() => handleBarberSelect(barber)}
                className={`flex flex-col items-center space-y-2 transition-all duration-300 group ${
                  selectedBarber.id === barber.id ? "text-accent" : "text-muted-foreground hover:text-accent"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors duration-300 ${
                    selectedBarber.id === barber.id ? "border-accent" : "border-muted group-hover:border-accent"
                  }`}
                >
                  <img
                    src={img(barber.avatar) || `${import.meta.env.BASE_URL}placeholder.svg?height=64&width=64`}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-semibold">{barber.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedBarber.services.map((service, index) => (
            <Card
              key={index}
              ref={(el) => {
                if (el) servicesRef.current[index] = el
              }}
              className={`bg-card border-border hover:border-accent transition-all duration-500 group overflow-hidden ${
                isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={img(service.image) || `${import.meta.env.BASE_URL}placeholder.svg?height=200&width=300`}
                  alt={service.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-accent text-black px-3 py-1 rounded-lg">
                  <span className="text-2xl font-bold">{service.price}</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {service.name}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                <Button
                  onClick={() => handleReservation(service)}
                  className="w-full bg-accent hover:bg-accent/90 text-black font-semibold"
                >
                  Reservar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showReservationForm && (
        <ReservationForm service={selectedService} onClose={() => setShowReservationForm(false)} />
      )}
    </section>
  )
}

function ReservationForm({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
  })

  const availableTimes = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Reservation data:", { ...formData, service: service.name, barber: service.barber })
    alert("¡Reserva enviada exitosamente! Te contactaremos pronto.")
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-foreground">Reservar Cita</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">
              ×
            </button>
          </div>

          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Servicio seleccionado:</p>
            <p className="font-semibold text-foreground">{service?.name}</p>
            <p className="text-sm text-muted-foreground">Estilista: {service?.barber}</p>
            <p className="text-accent font-bold">{service?.price}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Número de teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                placeholder="Tu número de teléfono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha preferida</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hora preferida</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              >
                <option value="">Selecciona una hora</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-black font-semibold">
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}