"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Users,
  Scissors,
  BarChart3,
  Calendar,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getToken, clearAuth } from "@/lib/useAuth"

// Rol Estilista (para nuevos perfiles creados por el admin)
const ROLE_STYLIST = 200

// Helper para llamar tu backend con token
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000"
const authHeaders = () => {
  const t = getToken?.()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const api = {
  async get(p) {
    const r = await fetch(`${API_BASE}${p}`, { headers: { ...authHeaders() } })
    if (!r.ok) throw new Error(`${r.status} ${p}`)
    return r.json()
  },
  async post(p, body) {
    const r = await fetch(`${API_BASE}${p}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data?.error || `${r.status} ${p}`)
    return data
  },
  async put(p, body) {
    const r = await fetch(`${API_BASE}${p}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data?.error || `${r.status} ${p}`)
    return data
  },
  async del(p) {
    const r = await fetch(`${API_BASE}${p}`, { method: "DELETE", headers: { ...authHeaders() } })
    if (!r.ok) {
      const data = await r.json().catch(() => ({}))
      throw new Error(data?.error || `${r.status} ${p}`)
    }
    return true
  },
}

export default function AdminDashboard({ onBack }) {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedBarberId, setSelectedBarberId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado real
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [barberoServicio, setBarberoServicio] = useState([]) // [{barbero_id, servicio_id, ...}]

  // Formularios
  const [editingBarber, setEditingBarber] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBarber, setNewBarber] = useState({
    nombre_artistico: "",
    nivel: "",
    bio: "",
    telefono: "",
    email: "",
    foto_url: "",
    password: "",
  })

  const [editingService, setEditingService] = useState(null)
  const [showAddServiceForm, setShowAddServiceForm] = useState(false)
  const [newService, setNewService] = useState({
    nombre: "",
    precio_base: "",
    duracion_min: "",
    descripcion: "",
    image: "",
    barberId: "",
  })

  // Manejo de 401
  const handleAuthError = (e) => {
    if (String(e).includes("401")) {
      clearAuth?.()
      navigate("/login", { replace: true })
      return true
    }
    return false
  }

  // Carga inicial
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [b, s] = await Promise.all([
          api.get("/catalogo/barberos"),
          api.get("/catalogo/servicios"),
        ])

        let bs = []
        try {
          bs = await api.get("/catalogo/barbero-servicio")
        } catch (e) {
          console.warn("No se encontró /catalogo/barbero-servicio (opcional):", e.message)
        }

        if (!mounted) return
        setBarbers(b || [])
        setServices(s || [])
        setBarberoServicio(bs || [])
      } catch (e) {
        if (handleAuthError(e)) return
        console.error(e)
        if (mounted) setError("No se pudieron cargar los datos")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => (mounted = false)
  }, [])

  // --------- Mapeos para la UI ---------
  const mappedBarbers = useMemo(
    () =>
      barbers.map((b) => ({
        id: b.id,
        name: b.nombre_artistico || "Sin nombre",
        specialty: b.nivel || "",
        experience: b.experience || "",
        phone: b.telefono || "",
        email: b.email || "",
        avatar: b.foto_url || "/placeholder.svg?height=64&width=64",
        bio: b.bio || "",
      })),
    [barbers]
  )

  const mappedServices = useMemo(() => {
    const byService = new Map()
    for (const s of services) {
      byService.set(s.id, {
        id: s.id,
        name: s.nombre,
        price: s.precio_base != null ? `$${Number(s.precio_base).toLocaleString()}` : "",
        duration: s.duracion_min != null ? `${s.duracion_min} min` : "",
        description: s.descripcion || "",
        image: s.image || "/placeholder.svg?height=200&width=300",
        barberIds: [],
      })
    }
    if (barberoServicio?.length) {
      for (const link of barberoServicio) {
        const item = byService.get(link.servicio_id)
        if (item) item.barberIds.push(link.barbero_id)
      }
    }
    return Array.from(byService.values())
  }, [services, barberoServicio])

  const servicesWithOneBarber = useMemo(
    () =>
      mappedServices.map((s) => ({
        ...s,
        barberId: s.barberIds?.[0] ?? null,
      })),
    [mappedServices]
  )

  const getBarberName = (barberId) => {
    const b = mappedBarbers.find((x) => x.id === barberId)
    return b ? b.name : "Sin asignar"
  }

  const getFilteredServices = () => {
    if (!selectedBarberId) return mappedServices
    const id = Number(selectedBarberId)
    return mappedServices.filter((s) => Array.isArray(s.barberIds) && s.barberIds.includes(id))
  }

  // --------- Stats ----------
  const stats = [
    { label: "Peluqueros Activos", value: mappedBarbers.length.toString(), icon: Users, color: "text-blue-500" },
    { label: "Servicios Disponibles", value: servicesWithOneBarber.length.toString(), icon: Scissors, color: "text-green-500" },
    { label: "Citas Hoy", value: "—", icon: Calendar, color: "text-purple-500" },
    { label: "Ingresos Mes", value: "—", icon: BarChart3, color: "text-yellow-500" },
  ]

  // --------- CRUD Barberos ----------
  const handleEditBarber = (barber) => setEditingBarber({ ...barber })

  const handleDeleteBarber = async (id) => {
    const prev = barbers
    setBarbers((xs) => xs.filter((b) => b.id !== id)) // optimistic
    try {
      await api.del(`/barberos/${id}`)
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("DELETE /barberos/:id falló, revirtiendo", e.message)
      setBarbers(prev)
    }
  }

  // PUT barbero (sin nulls)
  const handleSaveBarber = async () => {
    if (!editingBarber) return
    const payload = {
      nombre_artistico: editingBarber.name,
      nivel: editingBarber.specialty,
      bio: editingBarber.bio || "",
      telefono: editingBarber.phone || "",
      ...(editingBarber.email ? { email: editingBarber.email } : {}),
      ...(editingBarber.avatar ? { foto_url: editingBarber.avatar } : {}),
    }
    const prev = barbers
    setBarbers((xs) =>
      xs.map((b) => (b.id === editingBarber.id ? { ...b, ...payload } : b))
    )
    try {
      await api.put(`/barberos/${editingBarber.id}`, payload)
      setEditingBarber(null)
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("PUT /barberos/:id falló, revirtiendo", e.message)
      setBarbers(prev)
    }
  }

  // POST barbero (sin nulls) y usuario opcional si hay password >= 6
  const handleAddBarber = async () => {
    if (!newBarber.nombre_artistico || !newBarber.nivel) {
      alert("Nombre artístico y nivel son obligatorios")
      return
    }

    const email = (newBarber.email || "").trim()
    const foto  = (newBarber.foto_url || "").trim()

    const payload = {
      nombre_artistico: newBarber.nombre_artistico,
      nivel: newBarber.nivel,
      bio: newBarber.bio || "",
      telefono: newBarber.telefono || "",
      ...(email ? { email } : {}),
      ...(foto ? { foto_url: foto } : {}),
    }

    const pwd = (newBarber.password || "").trim()
    if (pwd.length > 0) {
      if (pwd.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres")
        return
      }
      payload.password = pwd
      payload.rol_id = ROLE_STYLIST
    }

    const tempId = Math.max(0, ...barbers.map((b) => b.id || 0)) + 1
    setBarbers((xs) => [...xs, { id: tempId, ...payload }])
    try {
      const created = await api.post("/barberos", payload)
      setBarbers((xs) => xs.map((b) => (b.id === tempId ? created : b)))
      setShowAddForm(false)
      setNewBarber({
        nombre_artistico: "",
        nivel: "",
        bio: "",
        telefono: "",
        email: "",
        foto_url: "",
        password: "",
      })
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("POST /barberos falló, revirtiendo", e.message)
      setBarbers((xs) => xs.filter((b) => b.id !== tempId))
    }
  }

  // --------- CRUD Servicios ----------
  const handleEditService = (service) => setEditingService({ ...service })

  const handleDeleteService = async (id) => {
    const prev = services
    setServices((xs) => xs.filter((s) => s.id !== id))
    try {
      await api.del(`/servicios/${id}`)
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("DELETE /servicios/:id falló, revirtiendo", e.message)
      setServices(prev)
    }
  }

  const handleSaveService = async () => {
    if (!editingService) return
    const payload = {
      nombre: editingService.name,
      descripcion: editingService.description || "",
      duracion_min: Number(String(editingService.duration).replace(/\D+/g, "")) || null,
      precio_base: Number(String(editingService.price).replace(/[^\d.-]/g, "")) || null,
      image: editingService.image || "",
    }
    const prev = services
    setServices((xs) => xs.map((s) => (s.id === editingService.id ? { ...s, ...payload } : s)))
    try {
      await api.put(`/servicios/${editingService.id}`, payload)
      setEditingService(null)
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("PUT /servicios/:id falló, revirtiendo", e.message)
      setServices(prev)
    }
  }

  const handleAddService = async () => {
    const payload = {
      nombre: newService.nombre,
      descripcion: newService.descripcion || "",
      duracion_min: Number(String(newService.duracion_min).replace(/\D+/g, "")) || null,
      precio_base: Number(String(newService.precio_base).replace(/[^\d.-]/g, "")) || null,
      image: newService.image || "",
      activo: true,
      barber_id: newService.barberId ? Number(newService.barberId) : undefined,
    }

    const tempId = Math.max(0, ...services.map((s) => s.id || 0)) + 1
    setServices((xs) => [...xs, { id: tempId, ...payload }])

    try {
      const created = await api.post("/servicios", payload)
      setServices((xs) => xs.map((s) => (s.id === tempId ? created : s)))

      setShowAddServiceForm(false)
      setNewService({
        nombre: "",
        precio_base: "",
        duracion_min: "",
        descripcion: "",
        image: "",
        barberId: "",
      })

      try {
        const bs = await api.get("/catalogo/barbero-servicio")
        setBarberoServicio(bs || [])
      } catch {}
    } catch (e) {
      if (handleAuthError(e)) return
      console.warn("POST /servicios falló, revirtiendo", e.message)
      setServices((xs) => xs.filter((s) => s.id !== tempId))
    }
  }

  // ------------------ UI ------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cargando panel…</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-destructive">{error}</div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-md bg-accent text-accent-foreground">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors duration-200">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <h1 className="text-xl font-bold text-foreground">Dashboard Administrativo</h1>
            </div>
            <div className="text-sm text-muted-foreground">Barbería Elite - Panel de Control</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
          {[
            { id: "overview", label: "Resumen", icon: BarChart3 },
            { id: "barbers", label: "Peluqueros", icon: Users },
            { id: "services", label: "Servicios", icon: Scissors },
            { id: "appointments", label: "Citas", icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>Usa “Peluqueros” y “Servicios” para administrar.</div>
              </div>
            </div>
          </div>
        )}

        {/* Barbers */}
        {activeTab === "barbers" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Peluqueros</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="h-4 w-4" /> Agregar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mappedBarbers.map((barber) => (
                <div key={barber.id} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center space-x-4">
                    <img src={barber.avatar} alt={barber.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{barber.name}</h4>
                      <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleEditBarber(barber)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal agregar barbero */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg border border-border w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Nuevo Peluquero</h4>
                    <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-muted rounded-md">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Nombre artístico"
                      value={newBarber.nombre_artistico}
                      onChange={(e) => setNewBarber((v) => ({ ...v, nombre_artistico: e.target.value }))}
                    />
                    {/* SELECT de nivel */}
                    <select
                      className="px-3 py-2 rounded-md bg-background border"
                      value={newBarber.nivel}
                      onChange={(e) => setNewBarber((v) => ({ ...v, nivel: e.target.value }))}
                    >
                      <option value="">Selecciona nivel</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid</option>
                      <option value="senior">Senior</option>
                      <option value="master">Master</option>
                    </select>
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Foto URL"
                      value={newBarber.foto_url}
                      onChange={(e) => setNewBarber((v) => ({ ...v, foto_url: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Teléfono"
                      value={newBarber.telefono}
                      onChange={(e) => setNewBarber((v) => ({ ...v, telefono: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Email"
                      value={newBarber.email}
                      onChange={(e) => setNewBarber((v) => ({ ...v, email: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Contraseña inicial (opcional)"
                      type="password"
                      value={newBarber.password}
                      onChange={(e) => setNewBarber((v) => ({ ...v, password: e.target.value }))}
                    />
                    <textarea
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Bio"
                      rows={3}
                      value={newBarber.bio}
                      onChange={(e) => setNewBarber((v) => ({ ...v, bio: e.target.value }))}
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-md border hover:bg-muted">
                      Cancelar
                    </button>
                    <button onClick={handleAddBarber} className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal editar barbero */}
            {editingBarber && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg border border-border w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Editar Peluquero</h4>
                    <button onClick={() => setEditingBarber(null)} className="p-2 hover:bg-muted rounded-md">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Nombre artístico"
                      value={editingBarber.name}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, name: e.target.value }))}
                    />
                    {/* SELECT de nivel */}
                    <select
                      className="px-3 py-2 rounded-md bg-background border"
                      value={editingBarber.specialty}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, specialty: e.target.value }))}
                    >
                      <option value="junior">Junior</option>
                      <option value="mid">Mid</option>
                      <option value="senior">Senior</option>
                      <option value="master">Master</option>
                    </select>
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Foto URL"
                      value={editingBarber.avatar}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, avatar: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Teléfono"
                      value={editingBarber.phone}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, phone: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Email"
                      value={editingBarber.email}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, email: e.target.value }))}
                    />
                    <textarea
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Bio"
                      rows={3}
                      value={editingBarber.bio || ""}
                      onChange={(e) => setEditingBarber((v) => ({ ...v, bio: e.target.value }))}
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setEditingBarber(null)} className="px-4 py-2 rounded-md border hover:bg-muted">
                      Cancelar
                    </button>
                    <button onClick={handleSaveBarber} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                      <Save className="h-4 w-4" /> Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services */}
        {activeTab === "services" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-foreground">Servicios</h3>
                <select
                  className="px-3 py-2 rounded-md bg-background border text-sm"
                  value={selectedBarberId}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                >
                  <option value="">Todos los barberos</option>
                  {mappedBarbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddServiceForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="h-4 w-4" /> Agregar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredServices().map((service) => {
                const displayedBarberId = selectedBarberId
                  ? Number(selectedBarberId)
                  : (service.barberIds?.[0] ?? null)

                return (
                  <div key={service.id} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="relative">
                      <img
                        src={service.image || "/placeholder.svg?height=200&width=300"}
                        alt={service.name}
                        className="w-full h-40 object-cover"
                      />
                      {service.price && (
                        <div className="absolute bottom-3 left-3 bg-accent text-black px-3 py-1 rounded-lg">
                          <span className="text-lg font-bold">{service.price}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-foreground">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="text-xs text-muted-foreground flex items-center gap-3">
                        {service.duration && <span>{service.duration}</span>}
                        {displayedBarberId && <span>• {getBarberName(displayedBarberId)}</span>}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Modal agregar servicio */}
            {showAddServiceForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg border border-border w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Nuevo Servicio</h4>
                    <button onClick={() => setShowAddServiceForm(false)} className="p-2 hover:bg-muted rounded-md">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Nombre"
                      value={newService.nombre}
                      onChange={(e) => setNewService((v) => ({ ...v, nombre: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Precio base (CLP)"
                      value={newService.precio_base}
                      onChange={(e) => setNewService((v) => ({ ...v, precio_base: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Duración (min)"
                      value={newService.duracion_min}
                      onChange={(e) => setNewService((v) => ({ ...v, duracion_min: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Imagen URL"
                      value={newService.image}
                      onChange={(e) => setNewService((v) => ({ ...v, image: e.target.value }))}
                    />
                    <textarea
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Descripción"
                      rows={3}
                      value={newService.descripcion}
                      onChange={(e) => setNewService((v) => ({ ...v, descripcion: e.target.value }))}
                    />
                    <select
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      value={newService.barberId}
                      onChange={(e) => setNewService((v) => ({ ...v, barberId: e.target.value }))}
                    >
                      <option value="">(Opcional) Asignar a Peluquero</option>
                      {mappedBarbers.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowAddServiceForm(false)} className="px-4 py-2 rounded-md border hover:bg-muted">
                      Cancelar
                    </button>
                    <button onClick={handleAddService} className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal editar servicio */}
            {editingService && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg border border-border w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Editar Servicio</h4>
                    <button onClick={() => setEditingService(null)} className="p-2 hover:bg-muted rounded-md">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Nombre"
                      value={editingService.name}
                      onChange={(e) => setEditingService((v) => ({ ...v, name: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Precio base (CLP)"
                      value={editingService.price}
                      onChange={(e) => setEditingService((v) => ({ ...v, price: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border"
                      placeholder="Duración (min)"
                      value={editingService.duration}
                      onChange={(e) => setEditingService((v) => ({ ...v, duration: e.target.value }))}
                    />
                    <input
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Imagen URL"
                      value={editingService.image}
                      onChange={(e) => setEditingService((v) => ({ ...v, image: e.target.value }))}
                    />
                    <textarea
                      className="px-3 py-2 rounded-md bg-background border col-span-2"
                      placeholder="Descripción"
                      rows={3}
                      value={editingService.description}
                      onChange={(e) => setEditingService((v) => ({ ...v, description: e.target.value }))}
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setEditingService(null)} className="px-4 py-2 rounded-md border hover:bg-muted">
                      Cancelar
                    </button>
                    <button onClick={handleSaveService} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                      <Save className="h-4 w-4" /> Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Appointments (placeholder) */}
        {activeTab === "appointments" && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-muted-foreground">Próximamente: listado y gestión de citas con Supabase.</div>
          </div>
        )}
      </div>
    </div>
  )
}