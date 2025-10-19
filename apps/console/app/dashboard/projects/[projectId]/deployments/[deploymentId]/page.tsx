import { redirect } from "next/navigation";

export default function Redirect({params}:{params:{projectId:string,deploymentId:string}}){
    return redirect(`/dashboard/projects/${params.projectId}/deployments/${params.deploymentId}/overview`)
}