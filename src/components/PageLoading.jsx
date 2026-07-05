export default function PageLoading({ label = 'Loading content' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }} aria-busy="true" aria-live="polite">
      <div className="skeleton" style={{ height:140, borderRadius:18 }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
        {[0, 1, 2].map(index => <div key={index} className="skeleton" style={{ height:220, borderRadius:18 }} />)}
      </div>
      <p style={{ color:'var(--muted)', fontSize:'0.85rem' }}>{label}</p>
    </div>
  )
}
