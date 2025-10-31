import { Prisma } from "@prisma/client";

export function normalizeSubscriptionData(
  data: Prisma.UserGetPayload<{
    select: {
      userId: true;
      email: true;
      fullName: true;
      avatarUri: true;
      provider: true;
      createdAt: true;
      updatedAt: true;
      emailVerified: true;
      subscription: {
        select: {
          subscriptionId: true;
          type: true;
          startedAt: true;
          endedAt: true;
          freePerks: true;
          proPerks: true;
        };
      };
    };
  }>
) {
  const { subscription, ...userData } = data;
  const { freePerks, proPerks, ...subscriptionData } = subscription || {};
  return {
    ...userData,
    subscription: {
      ...subscriptionData,
      perks: freePerks || proPerks,
    },
  };
}
