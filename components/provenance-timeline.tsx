import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProvenanceRecord {
  id: number
  event_type: string
  event_date: string
  description: string
  location: string | null
  documentation_url: string | null
  verified: boolean
}

interface ProvenanceTimelineProps {
  records: ProvenanceRecord[]
}

export function ProvenanceTimeline({ records }: ProvenanceTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEventIcon = (eventType: string) => {
    const types: Record<string, string> = {
      manufactured: "🏭",
      purchased: "🛒",
      serviced: "🔧",
      restored: "✨",
      authenticated: "🔍",
      sold: "💰",
      other: "📝",
    }
    return types[eventType] || "📝"
  }

  if (records.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Provenance History</h2>
        <p className="text-sm text-muted-foreground">No provenance records available for this watch.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Provenance History</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        A living record of this watch's journey through time. Verified events are authenticated by our experts.
      </p>

      <div className="space-y-4">
        {records.map((record, index) => (
          <div key={record.id} className="relative flex gap-4">
            {/* Timeline line */}
            {index !== records.length - 1 && <div className="absolute left-[19px] top-10 h-full w-0.5 bg-border" />}

            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-xl">
              {getEventIcon(record.event_type)}
            </div>

            {/* Content */}
            <div className="flex-1 rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {record.event_type.replace("_", " ")}
                  </Badge>
                  {record.verified && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(record.event_date)}</span>
              </div>

              <p className="mb-2 text-sm leading-relaxed text-foreground">{record.description}</p>

              {record.location && <p className="text-xs text-muted-foreground">📍 {record.location}</p>}

              {record.documentation_url && (
                <a
                  href={record.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-primary hover:underline"
                >
                  View documentation →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
