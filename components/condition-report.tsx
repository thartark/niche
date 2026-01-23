"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, FileCheck, Calendar } from "lucide-react"

interface ConditionReportProps {
  report: {
    grader_name: string
    grading_service: string
    overall_grade: string
    case_condition: string
    dial_condition: string
    movement_condition: string
    bracelet_condition?: string
    authenticity_score: number
    service_history: string
    notes: string
    report_url?: string
    graded_at: string
  }
}

const gradeColors: Record<string, string> = {
  Mint: "bg-emerald-500",
  Excellent: "bg-green-500",
  "Very Good": "bg-blue-500",
  Good: "bg-yellow-500",
  Fair: "bg-orange-500",
}

export function ConditionReport({ report }: ConditionReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Condition Report
            </CardTitle>
            <CardDescription>Certified by {report.grading_service}</CardDescription>
          </div>
          <Badge className={gradeColors[report.overall_grade]}>{report.overall_grade}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Authenticity Confidence</span>
            <span className="text-sm font-bold">{report.authenticity_score}%</span>
          </div>
          <Progress value={report.authenticity_score} className="h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Case</p>
            <p className="font-medium">{report.case_condition}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dial</p>
            <p className="font-medium">{report.dial_condition}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Movement</p>
            <p className="font-medium">{report.movement_condition}</p>
          </div>
          {report.bracelet_condition && (
            <div>
              <p className="text-xs text-muted-foreground">Bracelet</p>
              <p className="font-medium">{report.bracelet_condition}</p>
            </div>
          )}
        </div>

        {report.service_history && (
          <div>
            <p className="mb-1 text-sm font-medium">Service History</p>
            <p className="text-sm text-muted-foreground">{report.service_history}</p>
          </div>
        )}

        {report.notes && (
          <div>
            <p className="mb-1 text-sm font-medium">Expert Notes</p>
            <p className="text-sm text-muted-foreground">{report.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileCheck className="h-4 w-4" />
            <span>{report.grader_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(report.graded_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
