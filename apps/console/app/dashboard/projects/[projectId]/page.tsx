import { redirect } from "next/navigation";

export default async function Redirect({params}: {params: {projectId: string}}) {
    const {projectId} = await params
    return redirect(`/dashboard/projects/${projectId}/overview`);
}