import { NodeNamo } from "nodenamo";
import { IInsertStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class InsertCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let insert = <IInsertStatement> statement;

        let cursor:any = this.nodenamo
                         .insert(insert.object)
                         .into(this.getType(insert.into))
        
        if(insert.where)
        {
            cursor = cursor.where(insert.where?.conditionExpression, insert.where?.expressionAttributeNames, insert.where?.expressionAttributeValues)
        }

        return await cursor.execute();
    }
}