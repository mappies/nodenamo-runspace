import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { CreateTable } from 'nodenamo/dist/queries/createTable/createTable';
import { For } from 'nodenamo/dist/queries/createTable/for';
import { WithCapacityOf } from 'nodenamo/dist/queries/createTable/withCapacityOf';
import { CreateTableCommand } from '../src/commands/createTableCommand';

describe('CreateTableCommand', function () 
{
    let called:boolean;
    let nodenamo:IMock<NodeNamo>;

    beforeEach(()=>
    {
        called = true;
        nodenamo = Mock.ofType<NodeNamo>();
    });

    [
        {capacity: "", expectedReadCapacity: undefined, expectedWriteCapacity: undefined},
        {capacity: "WITH CAPACITY OF 123,456", expectedReadCapacity: 123, expectedWriteCapacity: 456}
    ]
    .forEach(test => 
    {
        it(`execute() - ${test.capacity}`, async () =>
        {
            let command = new CreateTableCommand(nodenamo.object)

            let mockedWithCapacityOf = Mock.ofType<WithCapacityOf>();
            mockedWithCapacityOf.setup(w => w.execute()).callback(()=>called=true).returns(async()=>{});

            let mockedFor = Mock.ofType<For>();
            mockedFor.setup(f => f.withCapacityOf(test?.expectedReadCapacity, test?.expectedWriteCapacity)).returns(()=>mockedWithCapacityOf.object)
            
            let mockedCreateTable = Mock.ofType<CreateTable>()
            mockedCreateTable.setup(c => c.for(It.isAny())).returns(()=>mockedFor.object)

            nodenamo.setup(n => n.createTable()).returns(()=>mockedCreateTable.object)
            
            let statement = parse(`CREATE TABLE for stores ${test.capacity}`)
            
            let result = await command.execute(statement);

            assert.isTrue(called);
        });
    });
});