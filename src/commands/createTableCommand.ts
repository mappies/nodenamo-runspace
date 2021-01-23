import { NodeNamo } from "nodenamo";
import { ICreateTableStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class CreateTableCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let createTable = <ICreateTableStatement> statement;

        return this.nodenamo
                   .createTable()
                   .for(this.getType(createTable.for))
                   .withCapacityOf(createTable.withCapacityOf?.readCapacity, createTable.withCapacityOf?.writeCapacity)
                   .execute()
    }
}