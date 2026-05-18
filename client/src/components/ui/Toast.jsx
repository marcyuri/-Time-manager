import { XCircle } from "lucide-react"
export function Toast({ message, type = 'info', onClose }) {
  if (!message) return null

  return (
    <div className={`toast toast--${type}`}>
      <p>{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le message"
      >
        <XCircle/>
      </button>
    </div>
  )
}