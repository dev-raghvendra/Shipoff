import { dbService } from "@/db/db-service";
import { $ProjectEvent, ProjectConsumer } from "@shipoff/redis";
import { logger } from "@shipoff/services-commons/libs/winston";

const projectConsumer = new ProjectConsumer("AUTH_SERVICE");

const operation: Record<
  keyof typeof $ProjectEvent,
  (projectId: string, userId: string) => Promise<void>
> = {
  CREATED: async (projectId, userId) => {
    try {
      await dbService.createProjectMember({
        projectId,
        userId,
        role: "PROJECT_OWNER",
      });
    } catch (e: any) {
      logger.error(
        `ERR_PROCESSING_CREATED_EVENT_FOR_PROJECT_ID_${projectId}_USER_ID_${userId}_IN_AUTH_SERVICE: ${JSON.stringify(e, null, 2)}`
      );
    }
  },
  DELETED: async (projectId, userId) => {
    try {
      await dbService.deleteProjectMember({
        userId_projectId: {
          projectId,
          userId,
        },
      });
    } catch (e: any) {
      logger.error(
        `ERR_PROCESSING_DELETED_EVENT_FOR_PROJECT_ID_${projectId}_USER_ID_${userId}_IN_AUTH_SERVICE: ${JSON.stringify(e, null, 2)}`
      );
    }
  },
};

export async function startProjectConsumer() {
  await projectConsumer.initializeConsumerGroup();
  await projectConsumer.readUnackedMessages(
    async ({ projectId, userId, event }) => {
      await operation[event](projectId, userId);
    }
  );
  projectConsumer.readNewMessages(async ({ projectId, userId, event }) => {
    await operation[event](projectId, userId);
  });
}
