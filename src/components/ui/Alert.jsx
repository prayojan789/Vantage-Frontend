import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const tones = {
  info: { Icon: Info, wrap: 'bg-blue-50 border-blue-200 text-blue-800' },
  success: { Icon: CheckCircle2, wrap: 'bg-green-50 border-green-200 text-green-800' },
  warning: { Icon: AlertTriangle, wrap: 'bg-amber-50 border-amber-200 text-amber-800' },
  danger: { Icon: AlertCircle, wrap: 'bg-red-50 border-red-200 text-red-800' },
}

export function Alert({ tone = 'info', title, children, onClose, className }) {
  const { Icon, wrap } = tones[tone] ?? tones.info
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 p-4 border rounded-lg text-sm', wrap, className)}
    >
      <Icon size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
