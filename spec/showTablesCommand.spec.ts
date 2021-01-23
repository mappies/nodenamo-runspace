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

        assert.isUndefined(command.getType('unload_table_tb1'))
    });

    it('execute() - non-existent table', async () =>
    {
        let command = new UnloadTableCommand(nodenamo.object)

        assert.isUndefined(command.getType('invalid'))
        
        let statement = parse('UNLOAD TABLE invalid')
        await command.execute(statement)

        assert.isUndefined(command.getType('invalid'))
    });
    
    afterEach(()=>
    {
        new UnloadTableCommand(nodenamo.object).removeTypes();
    });
});