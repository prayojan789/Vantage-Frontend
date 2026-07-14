// Vivid palette aligned with the new design system (#22c55e / #ef4444 / #f59e0b)
export const sentimentPill = s =>
  s === 'positive' ? 'pill pill-positive' : s === 'negative' ? 'pill pill-negative' : 'pill pill-neutral'

export const sentimentColor = s =>
  s === 'positive' ? '#22c55e' : s === 'negative' ? '#ef4444' : '#f59e0b'

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

/**
 * Chart palette — primary orange family + supporting tones.
 * Spec: orange #F59E0B, light orange #FDBA74, gold #FBBF24, beige #FDE68A, gray #CBD5E1
 */
export const CHART_PALETTE = {
  orange:      '#F59E0B',
  lightOrange: '#FDBA74',
  gold:        '#FBBF24',
  beige:       '#FDE68A',
  gray:        '#CBD5E1',
  positive:    '#22C55E',
  negative:    '#EF4444',
  neutral:     '#F59E0B',
  blue:        '#3B82F6',
}

export const CHART_COLORS = [
  CHART_PALETTE.orange,
  CHART_PALETTE.lightOrange,
  CHART_PALETTE.gold,
  CHART_PALETTE.beige,
  CHART_PALETTE.gray,
]
