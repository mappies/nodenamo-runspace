import {parse} from 'nodenamo-query-parser'
import {NodeNamo} from 'nodenamo'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { CommandFactory } from './commands/commandFactory';

export class Runspace
{
    factory:CommandFactory;
    
    constructor(config?:DocumentClient.DocumentClientOptions & ServiceConfigurationOptions & DynamoDB.ClientApiVersions)
    {
        let nodenamo = new NodeNamo(new DocumentClient(config));
        this.factory = new CommandFactory(nodenamo)
    }
    
    async execute(queryString:string): Promise<object>
    {
        let statement = parse(queryString)

        let command = this.factory.create(statement);

        return await command.execute(statement)
    }
}