import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { ShowTablesCommand } from '../src/commands/showTablesCommand';

describe('ShowTablesCommand', function () 
{
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute() - no tables', async () =>
    {
        let command = new ShowTablesCommand(nodenamo.object)

        let statement = parse('SHOW TABLES')
        
        let result = await command.execute(statement)

        assert.deepEqual(result, {items:[],lastEvaluatedKey:undefined})
    });

    it('execute() - with a table', async () =>
    {
        let command = new ShowTablesCommand(nodenamo.object)
        command.setType("show_tables_tb1", ShowTablesCommand)

        let statement = parse('SHOW TABLES')
        
        let result = await command.execute(statement)

        assert.deepEqual(result, {items:["show_tables_tb1"],lastEvaluatedKey:undefined})
    });
    
    afterEach(()=>
    {
        new ShowTablesCommand(nodenamo.object).removeTypes();
    });
});