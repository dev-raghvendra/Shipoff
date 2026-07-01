import { MetadataController } from "@/controllers/metadata.controller";
import { Router } from "express";

const metaDataRouter = Router();
const metadataController = new MetadataController();

metaDataRouter.get("/oauth-protected-resource",metadataController.protectedResource.bind(metadataController));
export { metaDataRouter };