"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Trash2 } from "lucide-react"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteProjectSettingsProps {
  projectId: string
  projectName?: string
}

export function DeleteProjectSettings({ projectId, projectName }: DeleteProjectSettingsProps) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const isConfirmed = confirmText === projectName

  const handleDelete = async () => {
    if (!isConfirmed) return
    setIsDeleting(true)
    try {
      await projectService.deleteProject({ projectId })
      toast.success("Project deleted successfully.")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-destructive">Delete Project</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Permanently delete this project and all of its deployments, environment variables, and
          domain configurations. This action cannot be undone.
        </p>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText("") }}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Project
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Project</DialogTitle>
            <DialogDescription>
              This action is <span className="font-semibold text-foreground">permanent and irreversible</span>.
              All deployments, environment variables, and domain settings for this project will be deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              To confirm, type{" "}
              <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">
                {projectName}
              </span>{" "}
              below:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={projectName}
              className="font-mono"
              autoComplete="off"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setOpen(false); setConfirmText("") }} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
