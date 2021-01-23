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
        return types.get(name)
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

    abstract execute(statement:IStatement): Promise<any>
}