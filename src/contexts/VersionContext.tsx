import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

interface VersionInfo {
  version: string
  minVersion: string
}

interface VersionContextValue {
  localVersion: string | null
  serverVersion: string | null
  updateAvailable: boolean
  isChecking: boolean
  checkError: string | null
  refresh: () => void
}

const VersionContext = createContext<VersionContextValue | null>(null)

function getLocalVersion(): string | null {
  const meta = document.querySelector('meta[name="app-version"]')
  return meta?.getAttribute('content') ?? null
}

function compareVersions(local: string, server: string): boolean {
  // Returns true if server version is newer than local
  const localParts = local.split('.').map(Number)
  const serverParts = server.split('.').map(Number)

  for (let i = 0; i < Math.max(localParts.length, serverParts.length); i++) {
    const localPart = localParts[i] || 0
    const serverPart = serverParts[i] || 0
    if (serverPart > localPart) return true
    if (serverPart < localPart) return false
  }
  return false
}

export function VersionProvider({ children }: { children: ReactNode }) {
  const [localVersion, setLocalVersion] = useState<string | null>(null)
  const [serverVersion, setServerVersion] = useState<string | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [checkError, setCheckError] = useState<string | null>(null)

  const checkVersion = async () => {
    setIsChecking(true)
    setCheckError(null)

    const local = getLocalVersion()
    setLocalVersion(local)

    try {
      // Add cache-busting query param to prevent cached response
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: VersionInfo = await response.json()
      setServerVersion(data.version)

      if (local && data.version) {
        const needsUpdate = compareVersions(local, data.version)
        setUpdateAvailable(needsUpdate)
      }
    } catch (error) {
      // On network error, allow app to continue (per PRP rule #3)
      console.warn('Version check failed:', error)
      setCheckError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsChecking(false)
    }
  }

  const refresh = () => {
    // Clear all caches and do a hard reload
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }

    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name))
      })
    }

    // Force hard reload
    window.location.reload()
  }

  useEffect(() => {
    checkVersion()
  }, [])

  return (
    <VersionContext.Provider
      value={{
        localVersion,
        serverVersion,
        updateAvailable,
        isChecking,
        checkError,
        refresh,
      }}
    >
      {children}
    </VersionContext.Provider>
  )
}

export function useVersion(): VersionContextValue {
  const context = useContext(VersionContext)
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider')
  }
  return context
}
