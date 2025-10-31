import { redirect } from "next/navigation";

export default async function Redirect({params}:{params:Promise<{projectId:string,deploymentId:string}>}){
    const {projectId,deploymentId} = await params
    return redirect(`/dashboard/projects/${projectId}/deployments/${deploymentId}/overview`)
}