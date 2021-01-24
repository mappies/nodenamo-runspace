import { IStatement } from "nodenamo-query-parser";

let types = new Map<string, {new (...args: any[]): any;}>();

export abstract class Command
{
    setType(name:string, type: {new (...args: any[]): any;}): void
    {
        types.set(name, type)
    }

    getType(name:string): {new (...args: any[]): any;}
    {
        let result = types.get(name);

        if(result === undefined)
        {
            throw new Error(`'${name}' could not be found. Use "IMPORT" to import it.`)
        }

        return result;
    }

    getTypes(): string[]
    {
        return [...types.keys()];
    }

    removeType(type:string): void
    {
        if(types.has(type))
        {
            types.delete(type);
        }
    }

    removeTypes(): void
    {
        types.clear()
    }

    abstract execute(statement:IStatement, options?:object): Promise<any>
}