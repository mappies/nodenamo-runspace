import {assert as assert} from 'chai';
import { FindCommand } from '../src/commands/findCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { Where } from 'nodenamo/dist/queries/find/where';
import { From } from 'nodenamo/dist/queries/find/from';
import { Find } from 'nodenamo/dist/queries/find/find';
import { Filter } from 'nodenamo/dist/queries/find/filter';
import { Order } from 'nodenamo/dist/queries/find/order';
import { Resume } from 'nodenamo/dist/queries/find/resume';
import { Limit } from 'nodenamo/dist/queries/find/limit';
import { StronglyConsistent } from 'nodenamo/dist/queries/find/stronglyConsistent';
import { Using } from 'nodenamo/dist/queries/find/using';
import { Test } from 'mocha';

describe('FindCommand', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = true;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    [
        {find: '*', expectedProjections: []},
        {find: 'id, name, email', expectedProjections: ['id','name','email']}
    ]
    .forEach(test => 
    {
        it(`execute() with ${test.find} projections`, async () =>
        {
            let command = new FindCommand(nodenamo.object)
            command.setType('user', Test)
    
            let mockedStronglyConsistent = Mock.ofType<StronglyConsistent>();
            mockedStronglyConsistent.setup(l => l.execute()).callback(()=>called=true).returns(async()=>({items:[],lastEvaluatedKey:undefined}));
    
            let mockedLimit = Mock.ofType<Limit>()
            mockedLimit.setup(l => l.stronglyConsistent(true)).returns(()=>mockedStronglyConsistent.object)
    
            let mockedUsing = Mock.ofType<Using>();
            mockedUsing.setup(u => u.limit(2)).returns(()=>mockedLimit.object);
    
            let mockedOrder = Mock.ofType<Order>();
            mockedOrder.setup(o => o.using('an-index')).returns(()=>mockedUsing.object);
    
            let mockedResume = Mock.ofType<Resume>();
            mockedResume.setup(r => r.order(false)).returns(()=>mockedOrder.object);
    
            let mockedFilter = Mock.ofType<Filter>();
            mockedFilter.setup(f => f.resume('token')).returns(()=>mockedResume.object);
    
            let mockedWhere = Mock.ofType<Where>();
            mockedWhere.setup(w => w.filter(It.isAny())).returns(()=>mockedFilter.object)
    
            let mockedFrom = Mock.ofType<From>();
            mockedFrom.setup(f => f.where(It.isAny())).returns(()=>mockedWhere.object)
            
            let mockedFind = Mock.ofType<Find>()
            mockedFind.setup(f => f.from(Test)).returns(()=>mockedFrom.object)
    
            nodenamo.setup(n => n.find(...test.expectedProjections)).returns(()=>mockedFind.object)
            
            let statement = parse(`find ${test.find} from user using an-index where name = "some one" filter email = "someone@example.com" resume "token" order desc limit 2 strongly consistent`)
            
            let result = await command.execute(statement);
    
            assert.isTrue(called);
            assert.deepEqual(result, {items:[],lastEvaluatedKey:undefined});
        });
    });
});