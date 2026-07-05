// Vivid, slightly desaturated palette aligned with the new design system
export const sentimentPill = s =>
  s === 'positive' ? 'pill pill-positive' : s === 'negative' ? 'pill pill-negative' : 'pill pill-neutral'

export const sentimentColor = s =>
  s === 'positive' ? '#10b981' : s === 'negative' ? '#ef4444' : '#f59e0b'

export const sentimentArrow = s =>
  s === 'positive' ? '↑' : s === 'negative' ? '↓' : '→'

export const fmtDate = iso =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''

export const fmtTime = iso =>
  iso ? new Date(iso).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' }) : ''

export const fmtRelative = iso => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff/60000)}m ago`
  if (h < 24) return `${h}h ago`
  return fmtDate(iso)
}

export const sourceClass = name => {
  if (name?.includes('Kathmandu')) return 'source-tkp'
  if (name?.includes('Republica') && !name.includes('My')) return 'source-rep'
  if (name?.includes('OnlineKhabar')) return 'source-okh'
  if (name?.includes('Himalayan')) return 'source-hmt'
  if (name?.includes('My Republica')) return 'source-mrep'
  if (name?.includes('Setopati')) return 'source-seto'
  return 'source-okh'
}
