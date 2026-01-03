import {
  ArrowDownCircle,
  Banknote,
  Percent,
  Settings2,
  CheckCircle2,
} from 'lucide-react'
import type { LoanEvent, LoanEventType } from '@/types/loan'
import { LOAN_EVENT_TYPE_LABELS } from '@/types/loan'

interface EventTimelineProps {
  events: LoanEvent[]
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface EventConfig {
  icon: React.ReactNode
  bgColor: string
  iconColor: string
}

function getEventConfig(type: LoanEventType): EventConfig {
  switch (type) {
    case 'disburse':
      return {
        icon: <ArrowDownCircle className="w-4 h-4" />,
        bgColor: 'bg-primary/20',
        iconColor: 'text-primary',
      }
    case 'principal_payment':
      return {
        icon: <Banknote className="w-4 h-4" />,
        bgColor: 'bg-success/20',
        iconColor: 'text-success',
      }
    case 'interest_payment':
      return {
        icon: <Percent className="w-4 h-4" />,
        bgColor: 'bg-warning/20',
        iconColor: 'text-warning',
      }
    case 'adjustment':
      return {
        icon: <Settings2 className="w-4 h-4" />,
        bgColor: 'bg-bg-tertiary',
        iconColor: 'text-text-tertiary',
      }
    case 'close':
      return {
        icon: <CheckCircle2 className="w-4 h-4" />,
        bgColor: 'bg-text-tertiary/20',
        iconColor: 'text-text-tertiary',
      }
  }
}

interface EventCardProps {
  event: LoanEvent
  isLast: boolean
}

function EventCard({ event, isLast }: EventCardProps) {
  const config = getEventConfig(event.type)

  return (
    <div className="flex gap-3">
      {/* Timeline line and icon */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor} ${config.iconColor}`}
        >
          {config.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-bg-tertiary my-1" />}
      </div>

      {/* Event content */}
      <div className={`flex-1 pb-4 ${isLast ? '' : 'border-b border-bg-secondary mb-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-text-primary">
              {LOAN_EVENT_TYPE_LABELS[event.type]}
            </p>
            {event.note && <p className="text-sm text-text-tertiary mt-0.5">{event.note}</p>}
          </div>
          <div className="text-right">
            {event.amount > 0 && (
              <p
                className={`font-semibold ${
                  event.type === 'disburse'
                    ? 'text-primary'
                    : event.type === 'principal_payment'
                      ? 'text-success'
                      : event.type === 'interest_payment'
                        ? 'text-warning'
                        : 'text-text-primary'
                }`}
              >
                ฿{formatAmount(event.amount)}
              </p>
            )}
            {event.type === 'interest_payment' && event.periodsCount && (
              <p className="text-xs text-text-tertiary">
                ({event.periodsCount} period{event.periodsCount !== 1 ? 's' : ''})
              </p>
            )}
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-1">{formatDate(event.createdAt)}</p>
      </div>
    </div>
  )
}

export function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="neo-card p-4">
        <p className="text-text-tertiary text-center py-4">No events yet</p>
      </div>
    )
  }

  return (
    <div className="neo-card p-4">
      <h3 className="text-xs text-text-tertiary uppercase tracking-wide mb-4">Timeline</h3>
      <div>
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} isLast={index === events.length - 1} />
        ))}
      </div>
    </div>
  )
}
