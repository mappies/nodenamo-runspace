import { NodeNamo } from "nodenamo";
import { IFindStatement, IStatement } from "nodenamo-query-parser";
import { Command } from "./command";

export class FindCommand extends Command
{
    constructor(private nodenamo:NodeNamo)
    {
        super();
    }

    async execute(statement:IStatement, options?:object): Promise<any>
    {
        let find = <IFindStatement> statement;
        
        if(options)
        {
            find.limit = options['limit'] || find.limit;
            find.resume = options['resume'] || find.resume;
        }

        let projections = (find.projections || []).filter(p => p !== '*');

        return await this.nodenamo
                         .find(...projections)
                         .from(this.getType(find.from))
                         .where(find.where)
                         .filter(find.filter)
                         .resume(find.resume)
                         .order(find.order)
                         .using(find.using)
                         .limit(find.limit)
                         .stronglyConsistent(find.stronglyConsistent)
                         .execute()
    }
}