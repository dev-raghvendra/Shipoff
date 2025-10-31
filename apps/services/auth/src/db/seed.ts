import { FreePerks, ProPerks } from "@prisma/index";
import { generateId } from "@shipoff/services-commons";
import { dbService } from "./db-service";


async function seedSubscriptions(){
    const freeSub : FreePerks = {
        perkId : generateId("PERK",{PERK:"perk"}),
        staticProjects:4,
        dynamicProjects:2
    }
    const proSub : ProPerks = {
        ...freeSub,
        perkId:generateId("PERK",{PERK:"perk"})
    }

    const freeS = await dbService.getClient.freePerks.create({
        data:freeSub
    })

    const proS = await dbService.getClient.proPerks.create({
        data:proSub
    })
    
    if(freeS.perkId && proS.perkId) console.log("SUBSCRIPTION_SEEDED")
    
}

seedSubscriptions().catch((e)=>console.error(e))