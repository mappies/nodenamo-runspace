import {assert as assert} from 'chai';
import { DeleteCommand } from '../src/commands/deleteCommand';
import { NodeNamo } from 'nodenamo';
import {Mock, It, IMock} from "typemoq";
import { parse } from 'nodenamo-query-parser';
import { Where } from 'nodenamo/dist/queries/delete/where';
import { From } from 'nodenamo/dist/queries/delete/from';
import { Delete } from 'nodenamo/dist/queries/delete/delete';
import { Test } from 'mocha';

describe('DeleteCommand', function () 
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
        let command = new DeleteCommand(nodenamo.object)
        command.setType('books', Test);

        let mockedWhere = Mock.ofType<Where>();
        mockedWhere.setup(w => w.execute()).callback(()=>called=true);
        
        let mockedFrom = Mock.ofType<From>();
        mockedFrom.setup(d => d.where(It.isAny())).returns(()=>mockedWhere.object);
        
        let mockedDelete = Mock.ofType<Delete>();
        mockedDelete.setup(d => d.from(Test)).returns(()=>mockedFrom.object);

        nodenamo.setup(n => n.delete(42)).returns(()=>mockedDelete.object);
        
        let statement = parse('DELETE 42 FROM books WHERE title = "A book"');
        
        await command.execute(statement);

        assert.isTrue(called);
    });
});