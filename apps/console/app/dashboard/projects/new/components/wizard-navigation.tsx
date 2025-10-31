import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface WizardStep {
  key: string
  label: string
}

interface WizardProgressProps {
  steps: WizardStep[]
  currentStep: number
  valid: Record<string, boolean>
  onStepChange: (step: number) => void
  onInvalidStep: (step: number) => void
}

export function WizardProgress({
  steps,
  currentStep,
  valid,
  onStepChange,
  onInvalidStep,
}: WizardProgressProps) {
  const canNavigateToStep = (targetStep: number) => {
    if (targetStep <= currentStep) return true
    if (targetStep > currentStep) {
      return Array.from({ length: targetStep }).every((_, i) => {
        const key = steps[i].key as keyof typeof valid
        return valid[key]
      })
    }
    return false
  }

  const handleStepClick = (step: number) => {
    if (canNavigateToStep(step)) {
      onStepChange(step)
    } else {
      onInvalidStep(step)
    }
  }

  return (
    <nav className="flex items-center gap-2 overflow-x-auto">
      {steps.map((s, idx) => (
        <div key={s.key} className="flex items-center shrink-0">
          <button
            className={`text-xs flex cursor-pointer justify-center items-center gap-2 sm:text-sm ${
              idx === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
            onClick={() => handleStepClick(idx)}
          >
            <div 
              className={`h-2 w-2 rounded-full ${
                idx <= currentStep ? "bg-primary" : "bg-muted-foreground/30"
              }`} 
            />
            {s.label}
          </button>
          {idx < steps.length - 1 && (
            <div 
              className={`mx-2 h-px w-6 ${
                idx <= currentStep ? "bg-primary" : "bg-muted-foreground/30"
              }`} 
            />
          )}
        </div>
      ))}
    </nav>
  )
}

interface WizardActionsProps {
  steps: WizardStep[]
  currentStep: number
  valid: Record<string, boolean>
  isCreating: boolean
  onBack: () => void
  onNext: () => void
  onCreate: () => void
}

export function WizardActions({
  steps,
  currentStep,
  valid,
  isCreating,
  onBack,
  onNext,
  onCreate,
}: WizardActionsProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const currentStepKey = steps[currentStep].key as keyof typeof valid
  const isCurrentStepValid = valid[currentStepKey]
  const allStepsValid = Object.values(valid).every(Boolean)

  return (
    <footer className="flex justify-between gap-2 border-t pt-3">
      <div className="text-xs text-muted-foreground self-center">
        Step {currentStep + 1} of {steps.length}
      </div>
      <div className="flex gap-2">
        {!isFirst && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        {!isLast && (
          <Button onClick={onNext} disabled={!isCurrentStepValid}>
            Next
          </Button>
        )}
        {isLast && (
          <Button onClick={onCreate} disabled={!allStepsValid || isCreating}>
            Create project
            {isCreating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        )}
      </div>
    </footer>
  )
}

