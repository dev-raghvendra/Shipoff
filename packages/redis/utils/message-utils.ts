export const flatenObject = (object: Record<string, string | number>) => {
    const flattened: string[] = [];
    for (const [key, val] of Object.entries(object)) {
        flattened.push(key);
        val ? flattened.push(String(val)) : flattened.push("");
    }
    return flattened;
}