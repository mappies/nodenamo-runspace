import {assert as assert} from 'chai';
import { GetCommand } from '../src/commands/getCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { StronglyConsistent } from 'nodenamo/dist/queries/get/stronglyConsistent';
import { From } from 'nodenamo/dist/queries/get/from';
import { Get } from 'nodenamo/dist/queries/get/get';
import { Test } from 'mocha';

describe('GetCommand', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = true;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    it('execute()', async () =>
    {
        let command = new GetCommand(nodenamo.object)
        command.setType('table_12', Test);

        let mockedStronglyConsistent = Mock.ofType<StronglyConsistent>();
        mockedStronglyConsistent.setup(w => w.execute()).callback(()=>called=true);
        
        let mockedFrom = Mock.ofType<From>();
        mockedFrom.setup(d => d.stronglyConsistent(true)).returns(()=>mockedStronglyConsistent.object);
        
        let mockedGet = Mock.ofType<Get>();
        mockedGet.setup(d => d.from(Test)).returns(()=>mockedFrom.object);

        nodenamo.setup(n => n.get(42)).returns(()=>mockedGet.object);
        
        let statement = parse('GET 42 FROM table_12 STRONGLY CONSISTENT');
        
        await command.execute(statement);

        assert.isTrue(called);
    });
});