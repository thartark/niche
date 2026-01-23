interface WatchSpecsProps {
  watch: {
    case_material: string | null
    case_diameter: string | null
    movement_type: string | null
    caliber: string | null
    serial_number: string | null
    service_history: string | null
  }
}

export function WatchSpecs({ watch }: WatchSpecsProps) {
  const specs = [
    { label: "Case Material", value: watch.case_material },
    { label: "Case Diameter", value: watch.case_diameter },
    { label: "Movement Type", value: watch.movement_type },
    { label: "Caliber", value: watch.caliber },
    { label: "Serial Number", value: watch.serial_number },
  ]

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Technical Specifications</h2>
      <div className="rounded-lg border border-border bg-card">
        <dl className="divide-y divide-border">
          {specs.map(
            (spec, index) =>
              spec.value && (
                <div key={index} className="grid grid-cols-2 gap-4 px-6 py-4">
                  <dt className="text-sm font-medium text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm text-foreground">{spec.value}</dd>
                </div>
              ),
          )}
        </dl>
      </div>

      {watch.service_history && (
        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-foreground">Service History</h3>
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
            {watch.service_history}
          </p>
        </div>
      )}
    </div>
  )
}
