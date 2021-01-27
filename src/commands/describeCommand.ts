import { NodeNamo } from "nodenamo";
import { IStatement, IDescribeStatement } from 'nodenamo-query-parser';
import { Command } from "./command";

export class DescribeCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let describe = <IDescribeStatement> statement;
        console.log(this.nodenamo
            .describe)
console.log(this.nodenamo.describe(this.getType(describe.name)))
        return await this.nodenamo
                   .describe(this.getType(describe.name))
                   .execute();
    }
}