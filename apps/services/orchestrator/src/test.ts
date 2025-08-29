import { OrchestratorService } from "./services/orchestrator.service";

new OrchestratorService().generateContainerJwt("prj-0198e744-d82f-7746-9b69-2a6d3c98504c").then(t=>console.log(t));