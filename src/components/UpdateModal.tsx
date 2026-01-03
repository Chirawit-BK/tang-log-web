import { useVersion } from '@/contexts/VersionContext'
import './UpdateModal.css'

export function UpdateModal() {
  const { updateAvailable, refresh } = useVersion()

  if (!updateAvailable) {
    return null
  }

  return (
    <div className="update-modal-overlay">
      <div className="update-modal">
        <h2 className="update-modal-title">Update Available</h2>
        <p className="update-modal-message">
          A new version of TangLog is available. Please refresh to continue.
        </p>
        <button className="update-modal-button" onClick={refresh}>
          Refresh Now
        </button>
      </div>
    </div>
  )
}
