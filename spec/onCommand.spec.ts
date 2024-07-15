import {assert as assert} from 'chai';
import { NodeNamo, ReturnValue } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { WithVersionCheck } from 'nodenamo/dist/queries/on/withVersionCheck';
import { Where } from 'nodenamo/dist/queries/on/where';
import { From } from 'nodenamo/dist/queries/on/from';
import { Add } from 'nodenamo/dist/queries/on/add';
import { Set } from 'nodenamo/dist/queries/on/set';
import { Delete } from 'nodenamo/dist/queries/on/delete';
import { Remove } from 'nodenamo/dist/queries/on/remove';
import { On } from 'nodenamo/dist/queries/on/on';
import { Test } from 'mocha';
import { OnCommand } from '../src/commands/onCommand';
import { Returning } from 'nodenamo/dist/queries/on/returning';

describe('OnCommand', function () 
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
        let command = new OnCommand(nodenamo.object)
        command.setType('users', Test);

        let mockedWithVersionCheck = Mock.ofType<WithVersionCheck>();
        mockedWithVersionCheck.setup(w => w.execute()).callback(()=>called=true);
        
        let mockedReturning = Mock.ofType<Returning>();
        mockedReturning.setup(w => w.withVersionCheck(true)).returns(()=>mockedWithVersionCheck.object);

        let mockedWhere = Mock.ofType<Where>();
        mockedWhere.setup(w => w.returning(ReturnValue.AllOld)).returns(()=>mockedReturning.object);
        
        let mockedRemove = Mock.ofType<Remove>();
        mockedRemove.setup(r => r.where(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedWhere.object);

        let mockedDelete = Mock.ofType<Delete>();
        mockedDelete.setup(d => d.remove(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedRemove.object);

        let mockedAdd = Mock.ofType<Add>();
        mockedAdd.setup(a => a.delete(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedDelete.object);

        let mockedSet = Mock.ofType<Set>();
        mockedSet.setup(s => s.add(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedAdd.object);

        let mockedFrom = Mock.ofType<From>();
        mockedFrom.setup(f => f.set(It.isAny(), It.isAny(), It.isAny())).returns(()=>mockedSet.object);
        
        let mockedOn = Mock.ofType<On>();
        mockedOn.setup(u => u.from(Test)).returns(()=>mockedFrom.object);

        nodenamo.setup(n => n.on(1)).returns(()=>mockedOn.object);
        
        let statement = parse('on 1 from users set name = "some one" add age 12 remove count delete colors "green" where begins_with(name, "some") returning allold with version check');
        
        await command.execute(statement);

        assert.isTrue(called);
    });
    
    afterEach(()=>
    {
        new OnCommand(nodenamo.object).removeTypes();
    });
});