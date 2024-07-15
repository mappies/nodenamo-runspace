import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { CommandFactory } from '../src/commands/commandFactory';
import { CreateTableCommand } from '../src/commands/createTableCommand';
import { DeleteCommand } from '../src/commands/deleteCommand';
import { DeleteTableCommand } from '../src/commands/deleteTableCommand';
import { ExplainCommand } from '../src/commands/explainCommand';
import { FindCommand } from '../src/commands/findCommand';
import { GetCommand } from '../src/commands/getCommand';
import { ImportCommand } from '../src/commands/importCommand';
import { InsertCommand } from '../src/commands/insertCommand';
import { ListCommand } from '../src/commands/listCommand';
import { OnCommand } from '../src/commands/onCommand';
import { ShowTablesCommand } from '../src/commands/showTablesCommand';
import { UnloadTableCommand } from '../src/commands/unloadTableCommand';
import { UpdateCommand } from '../src/commands/updateCommand';

describe('CommandFactory', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = true;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    [
        {type: 'create_table', expectedCommand: CreateTableCommand},
        {type: 'delete', expectedCommand: DeleteCommand},
        {type: 'delete_table', expectedCommand: DeleteTableCommand},
        {type: 'explain', expectedCommand: ExplainCommand},
        {type: 'find', expectedCommand: FindCommand},
        {type: 'get', expectedCommand: GetCommand},
        {type: 'import', expectedCommand: ImportCommand},
        {type: 'insert', expectedCommand: InsertCommand},
        {type: 'list', expectedCommand: ListCommand},
        {type: 'on', expectedCommand: OnCommand},
        {type: 'show_tables', expectedCommand: ShowTablesCommand},
        {type: 'unload_table', expectedCommand: UnloadTableCommand},
        {type: 'update', expectedCommand: UpdateCommand}
    ]
    .forEach(test => 
    {
        it(`execute() - ${test.type}`, async () =>
        {
            let command = new CommandFactory(nodenamo.object)

            assert.instanceOf(command.create({type: test.type}), <any> test.expectedCommand)
        });
    });

    it('execute() - statement does not exist', async () =>
    {
        let error;
        let factory = new CommandFactory(nodenamo.object);

        try
        {
            factory.create({type:'invalid'})
        }
        catch(e)
        {
            error = e
        }

        assert.isDefined(error)
    });
});