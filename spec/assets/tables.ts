import { DBTable, DBColumn } from "nodenamo";

@DBTable({name: 'shared-nn-table'})
export default class Table1
{
    @DBColumn({id: true})
    id: string;

    @DBColumn({range: true})
    get timestampIdRange(): string
    {
        return `${this.createdTimestamp}#${this.id}`;
    }
    @DBColumn()
    description: string;

    @DBColumn()
    name: string

    @DBColumn()
    createdTimestamp: string;
}

@DBTable({name: 'shared-nn-table'})
export class Table2
{
    @DBColumn({id: true})
    id: string;

    @DBColumn({hash: true})
    account:string;

    @DBColumn()
    name: string

    @DBColumn()
    timestamp:string;

    @DBColumn({range:true})
    get range():string
    {
        return `${this.timestamp}#${this.id}`
    }
}