import { NodeNamo } from "nodenamo";
import { IImportStatement, IStatement } from "nodenamo-query-parser";
import { resolve } from "path";
import { Command } from "./command";

export class ImportCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let imp = <IImportStatement> statement;
        
        for(let entity of imp.entities || [])
        {
            let absolutePath = resolve(process.cwd(), imp.from);

            let types = require(absolutePath);
            
            let type = entity.default ? types.default : types[entity.name]

            if(!type)
            {
                throw new Error(`Type '${entity.name}' does not exist in ${absolutePath}`)
            }

            this.setType(entity.as, type);
        }

        return imp.entities?.map(entity => entity.as) || [];
    }
}