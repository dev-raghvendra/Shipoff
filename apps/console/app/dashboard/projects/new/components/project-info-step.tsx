import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProjectInfoStepProps {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function ProjectInfoStep({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: ProjectInfoStepProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">Project name</label>
        <Input 
          className="mt-1" 
          value={name} 
          onChange={(e) => onNameChange(e.target.value)} 
          placeholder="my-awesome-app"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Description</label>
        <Textarea 
          className="mt-1" 
          rows={3} 
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="A brief description of your project"
        />
      </div>
    </div>
  )
}












