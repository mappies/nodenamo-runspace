import {assert as assert} from 'chai';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { DeleteTable } from 'nodenamo/dist/queries/deleteTable/deleteTable';
import { For } from 'nodenamo/dist/queries/deleteTable/for';
import { DeleteTableCommand } from '../src/commands/deleteTableCommand';

describe('DeleteTableCommand', function () 
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
        let command = new DeleteTableCommand(nodenamo.object)

        let mockedFor = Mock.ofType<For>();
        mockedFor.setup(f => f.execute()).callback(()=>called=true).returns(async()=>{});
        
        let mockedDeleteTable = Mock.ofType<DeleteTable>()
        mockedDeleteTable.setup(c => c.for(It.isAny())).returns(()=>mockedFor.object)

        nodenamo.setup(n => n.deleteTable()).returns(()=>mockedDeleteTable.object)
        
        let statement = parse(`DELETE TABLE for user`)
        
        await command.execute(statement);

        assert.isTrue(called);
    });
});