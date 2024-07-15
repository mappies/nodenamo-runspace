import {assert as assert} from 'chai';
import { UpdateCommand } from '../src/commands/updateCommand';
import { NodeNamo, ReturnValue } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { WithVersionCheck } from 'nodenamo/dist/queries/update/withVersionCheck';
import { Returning } from 'nodenamo/dist/queries/update/returning';
import { Where } from 'nodenamo/dist/queries/update/where';
import { From } from 'nodenamo/dist/queries/update/from';
import { Update } from 'nodenamo/dist/queries/update/update';
import { Test } from 'mocha';

describe('UpdateCommand', function () 
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
        let command = new UpdateCommand(nodenamo.object)
        command.setType('books', Test);

        let mockedWithVersionCheck = Mock.ofType<WithVersionCheck>();
        mockedWithVersionCheck.setup(w => w.execute()).callback(()=>called=true);
        
        let mockedReturning = Mock.ofType<Returning>();
        mockedReturning.setup(w => w.withVersionCheck(true)).returns(()=>mockedWithVersionCheck.object);

        let mockedWhere = Mock.ofType<Where>();
        mockedWhere.setup(w => w.returning(ReturnValue.AllNew)).returns(()=>mockedReturning.object);

        let mockedFrom = Mock.ofType<From>();
        mockedFrom.setup(f => f.where(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedWhere.object);
        
        let mockedUpdate = Mock.ofType<Update>();
        mockedUpdate.setup(u => u.from(Test)).returns(()=>mockedFrom.object);

        nodenamo.setup(n => n.update({id:2,title:"some thing",price:21,status:true})).returns(()=>mockedUpdate.object);
        
        let statement = parse('update {id:2,title:"some thing",price:21,status:true} from books where price = 20 returning allnew with version check');
        
        await command.execute(statement);

        assert.isTrue(called);
    });
});