export const flatenObject = (object: Record<string, string | number>) => {
    const flattened: string[] = [];
    for (const [key, val] of Object.entries(object)) {
        flattened.push(key);
        val ? flattened.push(String(val)) : flattened.push("");
    }
    return flattened;
}

export function createObject<T extends Record<string,string>>(message:string[]): T {
    const res:Record<string, string> = {};
    for(let i = 0 ; i < message.length - 1; i+=2){
        const key = message[i];
        const val = message[i+1];
        res[key] = val;
    }
    return res as T;
}