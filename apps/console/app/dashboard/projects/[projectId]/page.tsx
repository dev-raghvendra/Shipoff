import { redirect } from "next/navigation";

export default function Redirect({params}: {params: {projectId: string}}) {
    return redirect(`/dashboard/projects/${params.projectId}/overview`);
}