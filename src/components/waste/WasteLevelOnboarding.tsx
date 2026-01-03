import { useState, useEffect } from 'react'
import { X, Lightbulb } from 'lucide-react'
import {
  hasSeenWasteLevelOnboarding,
  markWasteLevelOnboardingSeen,
} from '@/utils/wasteLevel'

interface WasteLevelOnboardingProps {
  children: React.ReactNode
}

export function WasteLevelOnboarding({ children }: WasteLevelOnboardingProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    if (!hasSeenWasteLevelOnboarding()) {
      setShowOnboarding(true)
    }
  }, [])

  const handleDismiss = () => {
    markWasteLevelOnboardingSeen()
    setShowOnboarding(false)
  }

  return (
    <div className="relative">
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-xl relative">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-primary/60 hover:text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-2 pr-6">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">
                Track your spending habits
              </p>
              <p className="text-xs text-primary/80 mt-1">
                Categorizing expenses by waste level helps you understand where your money goes
                and identify areas to save.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selector */}
      {children}
    </div>
  )
}
