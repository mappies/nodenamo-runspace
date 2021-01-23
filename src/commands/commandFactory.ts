import { NodeNamo } from "nodenamo";
import { IStatement } from "nodenamo-query-parser";
import { Command } from "./command";
import { CreateTableCommand } from "./createTableCommand";
import { FindCommand } from "./findCommand";
import { ImportCommand } from './importCommand';
import { ListCommand } from "./listCommand";
import { ShowTablesCommand } from "./showTablesCommand";
import { UnloadTableCommand } from './unloadTableCommand';
import { DeleteTableCommand } from './deleteTableCommand';
import { DeleteCommand } from "./deleteCommand";
import { GetCommand } from "./getCommand";
import { UpdateCommand } from "./updateCommand";
import { InsertCommand } from "./insertCommand";
import { OnCommand } from "./onCommand";
import { ExplainCommand } from './explainCommand';

export class CommandFactory
{
    constructor(private nodenamo:NodeNamo)
    {

    }

    create(statement:IStatement): Command
    {
        switch(statement.type)
        {
            case 'get': return new GetCommand(this.nodenamo)
            case 'find': return new FindCommand(this.nodenamo)
            case 'list': return new ListCommand(this.nodenamo)
            case 'insert': return new InsertCommand(this.nodenamo)
            case 'update': return new UpdateCommand(this.nodenamo)
            case 'delete': return new DeleteCommand(this.nodenamo)
            case 'on': return new OnCommand(this.nodenamo)
            case 'import': return new ImportCommand(this.nodenamo)
            case 'explain': return new ExplainCommand(this.nodenamo)
            case 'show_tables': return new ShowTablesCommand(this.nodenamo)
            case 'unload_table': return new UnloadTableCommand(this.nodenamo)
            case 'create_table': return new CreateTableCommand(this.nodenamo)
            case 'delete_table': return new DeleteTableCommand(this.nodenamo)
            default:
                throw new Error(`Unrecognized statement: '${statement.type}'`)
        }
    }
}