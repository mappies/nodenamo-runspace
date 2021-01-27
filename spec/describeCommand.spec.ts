import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { DescribeCommand } from '../src/commands/describeCommand';
import { Test } from 'mocha';
import { Describe } from 'nodenamo/dist/queries/describe/describe';

describe('DescribeCommand', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = false;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute()', async () =>
    {
        let mockedDescribe = Mock.ofType<Describe>()
        mockedDescribe.setup(f => f.execute()).callback(()=>called=true).returns(async()=>({type: 'describe', name: 'users'}));

        nodenamo.setup(n => n.describe(Test)).returns(()=>mockedDescribe.object)

        let command = new DescribeCommand(nodenamo.object)
        command.setType('users', Test)

        let statement = parse('describe users')
        
        let result = await command.execute(statement)

        assert.deepEqual(result, {type: 'describe', name: 'users'})
    });
});