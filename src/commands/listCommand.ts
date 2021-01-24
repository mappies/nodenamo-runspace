import { NodeNamo } from "nodenamo";
import { IListStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class ListCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement, options?:object): Promise<any>
    {
        let list = <IListStatement> statement;
        
        if(options)
        {
            list.limit = options['limit'] || list.limit;
            list.resume = options['resume'] || list.resume;
        }

        let projections = (list.projections || []).filter(p => p !== '*');

        return await this.nodenamo
                         .list(...projections)
                         .from(this.getType(list.from))
                         .by(list.by?.hash, list.by?.range)
                         .filter(list.filter)
                         .resume(list.resume)
                         .order(list.order)
                         .using(list.using)
                         .limit(list.limit)
                         .stronglyConsistent(list.stronglyConsistent)
                         .execute()
    }
}