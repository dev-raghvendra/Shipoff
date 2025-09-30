import { SECRETS } from "@/config";
import { ProjectsService } from "@/services/project.service";
import { PopulatedRequest } from "@/types/request";
import { notFound } from "@/util/res.util";
import { NextFunction, Response } from "express";

const projectsService = new ProjectsService()

const staticExtensions = [
  ".html", ".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".gif",
  ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".mp4"
];

export async function resolveDestinationMiddleware(req:PopulatedRequest, res:Response, next:NextFunction) {
     const url = req.url as string 
     const project = await projectsService.getProjectByDomain(req.hostname,{requestId:req.rid as string})
     if(!project) return notFound.call(res,req)
     req.project = project
     if(project.projectType === "STATIC"){
        const isStatic = staticExtensions.some(ext=>url.endsWith(ext))
        if(!isStatic) req.destination = new URL(`${SECRETS.BUCKET_URL}/${project.projectId}/index.html`)
        else req.destination = new URL(`${SECRETS.BUCKET_URL}/${project.projectId}${url}`)
     } 
     else  req.destination = new URL(`http://${project.projectId}.${SECRETS.DYNAMIC_APPS_CLUSTER_BASE_HOST}${url}`)
     next()
}