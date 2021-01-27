import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { UnloadTableCommand } from '../src/commands/unloadTableCommand';

describe('UnloadTableCommand', function () 
{
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute()', async () =>
    {
        let command = new UnloadTableCommand(nodenamo.object)

        let statement = parse('UNLOAD TABLE invalid')
        
        let result = await command.execute(statement)
    });

    it('execute()', async () =>
    {
        let command = new UnloadTableCommand(nodenamo.object)
        command.setType("unload_table_tb1", UnloadTableCommand)
        
        assert.isDefined(command.getType('unload_table_tb1'))
        
        let statement = parse('UNLOAD TABLE unload_table_tb1')
        await command.execute(statement)

        let error
        try
        {
            command.getType('unload_table_tb1')
            assert.fail('An error is expected.')
        }
        catch(e)
        {
            error = e
        }

        assert.isDefined(error)
    });

    it('execute() - a non-existent table', async () =>
    {
        let command = new UnloadTableCommand(nodenamo.object)

        
        let error
        try
        {
            command.getType('invalid')
            assert.fail('An error is expected.')
        }
        catch(e)
        {
            error = e
        }

        assert.isDefined(error)
    });
    
    afterEach(()=>
    {
        new UnloadTableCommand(nodenamo.object).removeTypes();
    });
});