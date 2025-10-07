export interface UserData  {
    userId:string,
    fullname:string,
    email:string,
    emailVerified:boolean,
    avatarUri:string,
    provider:"GOOGLE" | "GITHUB" | "EMAIL"
}