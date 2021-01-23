import { NodeNamo } from "nodenamo";
import { IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class ShowTablesCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let tables = this.getTypes();

        return {items: tables, lastEvaluatedKey: undefined}
    }
}