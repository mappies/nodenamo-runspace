import { NodeNamo } from "nodenamo";
import { IExplainStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class ExplainCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement): Promise<any>
    {
        let explain = <IExplainStatement> statement;

        return explain.statement;
    }
}