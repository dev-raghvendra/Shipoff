import { compare as bcryptComp} from "bcrypt";

export async function compare(val:string,hashedVal:string){
    try {
      return await bcryptComp(val,hashedVal);
    } catch (e) {
      return false;
    }
}