import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { ExplainCommand } from '../src/commands/explainCommand';

describe('ExplainCommand', function () 
{
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute()', async () =>
    {
        let command = new ExplainCommand(nodenamo.object)

        let statement = parse('explain insert {id:1,name:"some one",description:"a person"} into users')
        
        let result = await command.execute(statement)

        assert.deepEqual(result, {type: 'insert', object: {id:1,name:"some one",description:"a person"}, into: 'users', where: undefined})
    });
});