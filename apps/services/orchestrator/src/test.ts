import { K8Service } from "./services/k8.service";

new K8Service().createBuildContainer({projectId:"prj-0199010d-25b7-748a-8341-a4364ec00e04"}).then(t=>console.log(t));