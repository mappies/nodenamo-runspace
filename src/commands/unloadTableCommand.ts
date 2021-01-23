import { NodeNamo } from "nodenamo";
import { IStatement, IUnloadTableStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class UnloadTableCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let unload = <IUnloadTableStatement> statement;

        this.removeType(unload.name);
        
        return true
    }
}