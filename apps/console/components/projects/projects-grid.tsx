import ProjectCard, {ProjectItem} from "./project-card"

export function ProjectsGrid({ projects }: { projects: ProjectItem[] }) {
  if (!projects?.length) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No projects yet. Create your first project to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.projectId} item={p} />
      ))}
    </div>
  )
}
