import {assert as assert} from 'chai';
import { InsertCommand } from '../src/commands/insertCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { Where } from 'nodenamo/dist/queries/insert/where';
import { Into } from 'nodenamo/dist/queries/insert/into';
import { Insert } from 'nodenamo/dist/queries/insert/insert';
import { Test } from 'mocha';

describe('InsertCommand', function () 
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
        let command = new InsertCommand(nodenamo.object)
        command.setType('books', Test);

        let mockedWhere = Mock.ofType<Where>();
        mockedWhere.setup(w => w.execute()).callback(()=>called=true);

        let mockedInto = Mock.ofType<Into>();
        mockedInto.setup(f => f.where(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedWhere.object);
        
        let mockedInsert = Mock.ofType<Insert>();
        mockedInsert.setup(i => i.into(Test)).returns(()=>mockedInto.object);

        nodenamo.setup(n => n.insert({id:2,title:"some thing",price:21,status:true})).returns(()=>mockedInsert.object);
        
        let statement = parse('insert {id:2,title:"some thing",price:21,status:true} into books where attribute_not_exists(id)');
        
        await command.execute(statement);

        assert.isTrue(called);
    });
});