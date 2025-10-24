import { FreeSubscriptionPerks, ProSubscriptionPerks } from "@prisma/index";
import { generateId } from "@shipoff/services-commons";
import { dbService } from "./db-service";


async function seedSubscriptions(){
    const freeSub : FreeSubscriptionPerks = {
        perkId : generateId("PERK",{PERK:"perk"}),
        staticProjects:4,
        dynamicProjects:2
    }
    const proSub : ProSubscriptionPerks = {
        ...freeSub,
        perkId:generateId("PERK",{PERK:"perk"})
    }

    const freeS = await dbService.getClient.freeSubscriptionPerks.create({
        data:freeSub
    })

    const proS = await dbService.getClient.proSubscriptionPerks.create({
        data:proSub
    })
    
    if(freeS.perkId && proS.perkId) console.log("SUBSCRIPTION_SEEDED")
    
}

seedSubscriptions().catch((e)=>console.error(e))