import { NodeNamo } from "nodenamo";
import { IDeleteTableStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class DeleteTableCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let createTable = <IDeleteTableStatement> statement;

        return this.nodenamo
                   .deleteTable()
                   .for(this.getType(createTable.for))
                   .execute()
    }
}