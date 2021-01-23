import { NodeNamo } from "nodenamo";
import { IDeleteStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class DeleteCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let del = <IDeleteStatement> statement;

        return await this.nodenamo
                         .delete(del.id)
                         .from(this.getType(del.from))
                         .where(del.where)
                         .execute()
    }
}