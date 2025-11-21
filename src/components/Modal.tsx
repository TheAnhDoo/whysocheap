'use client'

type ModalProps = {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

export default function Modal({ open, title, children, onClose, primaryAction, secondaryAction }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-strong w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
          <button onClick={onClose} className="text-primary-500 hover:text-primary-700">✕</button>
        </div>
        <div className="text-primary-800 text-sm">
          {children}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="mt-6 flex justify-end gap-3">
            {secondaryAction && (
              <button onClick={secondaryAction.onClick} className="btn-secondary px-4 py-2 rounded">
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button onClick={primaryAction.onClick} className="btn-primary px-4 py-2 rounded">
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


