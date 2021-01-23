import {assert as assert} from 'chai';
import { ImportCommand } from '../src/commands/importCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import Table1, { Table2 } from './assets/tables';

describe('ImportCommand', function () 
{
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute()', async () =>
    {
        let command = new ImportCommand(nodenamo.object)

        let statement = parse('import Table1 as tb1, {Table2 as tb2} from "./assets/tables.ts"')
        
        let result = await command.execute(statement)

        assert.deepEqual(result, ['tb1', 'tb2'])
        assert.equal(command.getType('tb1'), Table1);
        assert.equal(command.getType('tb2'), Table2);
    });

    it('execute() - file does not exist', async () =>
    {
        let error

        let command = new ImportCommand(nodenamo.object)

        let statement = parse('import user as user_alias from "./assets/invalid.ts"')
        
        try
        {
            await command.execute(statement)
        }
        catch(e)
        {
            error = e
        }

        assert.isDefined(error)
        assert.isTrue(error.message.includes('Cannot find module'))
    });

    it('execute() - type does not exist', async () =>
    {
        let error

        let command = new ImportCommand(nodenamo.object)

        let statement = parse('import {invalid} from "./assets/tables.ts"')
        
        try
        {
            await command.execute(statement)
        }
        catch(e)
        {
            error = e
        }

        assert.isDefined(error)
        assert.isTrue(error.message.includes("Type 'invalid' does not exist"))
    });
    
    afterEach(()=>
    {
        new ImportCommand(nodenamo.object).removeTypes();
    });
});