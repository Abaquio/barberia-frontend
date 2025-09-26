const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error(`GET ${path} ${res.status}`)
    return res.json()
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || `POST ${path} ${res.status}`)
    return data
  }
}
async function linkServiceToBarber(servicioId, barberId) {
  if (!servicioId || !barberId) return
  try {
    await api.post("/barbero-servicio", {
      barbero_id: Number(barberId),
      servicio_id: Number(servicioId),
      // puedes enviar precio/duracion override si lo soportas en tu UI:
      // precio: null,
      // duracion_min_override: null,
    })
  } catch (e) {
    console.warn("No se pudo vincular servicio con barbero:", e.message)
  }
}

