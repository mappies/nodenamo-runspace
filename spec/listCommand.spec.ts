import {assert as assert} from 'chai';
import { ListCommand } from '../src/commands/listCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { By } from 'nodenamo/dist/queries/find/by';
import { ListFrom } from 'nodenamo/dist/queries/find/listFrom';
import { Filter } from 'nodenamo/dist/queries/find/filter';
import { Order } from 'nodenamo/dist/queries/find/order';
import { Resume } from 'nodenamo/dist/queries/find/resume';
import { Limit } from 'nodenamo/dist/queries/find/limit';
import { StronglyConsistent } from 'nodenamo/dist/queries/find/stronglyConsistent';
import { Using } from 'nodenamo/dist/queries/find/using';
import { List } from 'nodenamo/dist/queries/find/list';
import { Test } from 'mocha';

describe('ListCommand', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = true;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    [
        {list: '*', expectedProjections: [], by: '"hash"', expectedBy: {hash: "hash", range: undefined}},
        {list: 'id, name, email', expectedProjections: ['id','name','email'], by: '"hash"', expectedBy: {hash: "hash", range: undefined}},
        {list: '*', expectedProjections: [], by: '"hash"', expectedBy: {hash: "hash", range: undefined}},
        {list: '*', expectedProjections: [], by: '"hash","range"', expectedBy: {hash: "hash", range: "range"}}
    ]
    .forEach(test => 
    {
        it(`execute() with ${test.list} projections`, async () =>
        {
            let command = new ListCommand(nodenamo.object);
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
    
            let mockedBy = Mock.ofType<By>();
            mockedBy.setup(w => w.filter(It.isAny())).returns(()=>mockedFilter.object)
    
            let mockedFrom = Mock.ofType<ListFrom>();
            mockedFrom.setup(f => f.by(test.expectedBy.hash,test.expectedBy.range)).returns(()=>mockedBy.object)
            
            let mockedList = Mock.ofType<List>()
            mockedList.setup(f => f.from(Test)).returns(()=>mockedFrom.object)
    
            nodenamo.setup(n => n.list(...test.expectedProjections)).returns(()=>mockedList.object)
            
            let statement = parse(`list ${test.list} from user using an-index by ${test.by} filter email = "someone@example.com" resume "token" order desc limit 2 strongly consistent`)
            
            let result = await command.execute(statement);
    
            assert.isTrue(called);
            assert.deepEqual(result, {items:[],lastEvaluatedKey:undefined});
        });
    });
});