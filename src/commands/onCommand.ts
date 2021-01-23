import { NodeNamo } from "nodenamo";
import { IOnStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class OnCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let on = <IOnStatement> statement;

        let cursor:any = this.nodenamo
                         .on(on.id)
                         .from(this.getType(on.from))

        if(on.set)
        {
            cursor = cursor.set(on.set?.setExpressions, on.set?.expressionAttributeNames, on.set?.expressionAttributeValues)
        }

        if(on.add)
        {
            cursor = cursor.add(on.add?.addExpressions, on.add?.expressionAttributeNames, on.add?.expressionAttributeValues)
        }

        if(on.delete)
        {
            cursor = cursor.delete(on.delete?.deleteExpressions, on.delete?.expressionAttributeNames, on.delete?.expressionAttributeValues)
        }

        if(on.remove)
        {
            cursor = cursor.remove(on.remove?.removeExpressions, on.remove?.expressionAttributeNames, on.remove?.expressionAttributeValues)
        }

        if(on.where)
        {
            cursor = cursor.where(on.where?.conditionExpression, on.where?.expressionAttributeNames, on.where.expressionAttributeValues)
        }

        return await cursor.withVersionCheck(on.versionCheck).execute();
    }
}