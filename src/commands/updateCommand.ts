import { NodeNamo } from "nodenamo";
import { IUpdateStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class UpdateCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let update = <IUpdateStatement> statement;

        let cursor:any = this.nodenamo
                         .update(update.object)
                         .from(this.getType(update.from))

        if(update.where)
        {
            cursor = cursor.where(update.where?.conditionExpression, update.where?.expressionAttributeNames, update.where?.expressionAttributeValues);
        }
        
        if(update.returnValue)
        {
            cursor = cursor.returning(update.returnValue);
        }

        return await cursor.withVersionCheck(update.versionCheck).execute();
    }
}