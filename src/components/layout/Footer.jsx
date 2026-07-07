import { Link } from 'react-router-dom'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { FOOTER_LINKS } from '../../layouts/navConfig.jsx'

/**
 * Footer
 *
 * Site footer used inside the AppLayout. Surfaces a brand mark, the
 * platform's link groups, a short description, and a small status line.
 *
 * Stays out of the way: it does not fix itself to the viewport, and it
 * respects the page's max width.
 */
const SOCIAL = [
  { label: 'GitHub',   href: '#', Icon: Github },
  { label: 'Twitter',  href: '#', Icon: Twitter },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

export default function Footer({ className }) {
  return (
    <footer
      className={cn(
        'mt-12 border-t border-border bg-surface text-text-muted',
        className,
      )}
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,_1fr)]">
          {/* Brand block */}
          <div className="space-y-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                <Sparkles size={14} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-text">Vantage</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              An AI-powered news intelligence platform built to help journalists,
              researchers, and policy analysts understand how Nepali publishers
              cover the same event — at a glance.
            </p>
            <ul className="flex items-center gap-1 pt-1">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
                  >
                    <Icon size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map(group => (
            <div key={group.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted mb-3">
                {group.title}
              </p>
              <ul className="space-y-2">
                {group.links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <span>© 2026 Vantage · Nepal News Intelligence</span>
          <span className="font-mono tracking-wide text-text-muted">
            v1.0 · distilbert-vantage-v1
          </span>
        </div>
      </div>
    </footer>
  )
}
