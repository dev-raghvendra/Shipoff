import {RuntimesType} from "@shipoff/types"
export const IMAGE_CONFIG : ImageConfig = {
     nodejs:{
        static:{
            image:"nodejs-static"
        },
        dynamic:{
            image:"nodejs-dynamic"
        }
     },
     python:{
         dynamic:{
            image:"python-dynamic"
         }
     },
     php:{
        dynamic:{
            image:"php-dynamic"
        }
     }
} as const;


type ImageConfig = {
    [key in Lowercase<RuntimesType>]:{
        static?:{
            image:`${key}-static`
        },
        dynamic?:{
            image:`${key}-dynamic`
        }
    }
} 