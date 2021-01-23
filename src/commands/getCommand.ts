import { NodeNamo } from "nodenamo";
import { IGetStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class GetCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let get = <IGetStatement> statement;

        return await this.nodenamo
                         .get(get.id)
                         .from(this.getType(get.from))
                         .stronglyConsistent(get.stronglyConsistent)
                         .execute()
    }
}