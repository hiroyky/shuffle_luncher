import { DynamoDB, AWSError } from 'aws-sdk';
import DocumentClient = DynamoDB.DocumentClient;
import Env from '../env';
import * as util from './storage-util';
import { User } from '../models';
import { BooleanNullable } from 'aws-sdk/clients/glue';

export default class {
    protected db = new DocumentClient();
    protected env: Env;

    constructor(env: Env) {
        this.env = env;
    }

    async getUser(slackId: string): Promise<User> {
        const param: DocumentClient.GetItemInput = {
            TableName: this.env.dynamoDBTableName,
            Key: { "slack_id": slackId },
        };
        const result = await this.db.get(param).promise();
        if(result.Item === undefined) {
            throw new AWSError(`failed to get User ${param}`);
        }
        return new User(result.Item);
    }

    async scanUsers(): Promise<User[]> {
        const param: DocumentClient.ScanInput = {
            TableName: this.env.dynamoDBTableName,
        };
        const result = await this.db.scan(param).promise();
        if(result.Items === undefined) {
            throw new Error(`failed to scan Users ${param}`);
        }
        return result.Items.map(item => new User(item));
    }

    async updateUserAttedance(slackId: string, date: Date, isAttendance:boolean) {
        const param: DocumentClient.UpdateItemInput = {
            TableName: this.env.dynamoDBTableName,
            Key: { 'slack_id': slackId },
            UpdateExpression: "set #date = :attendace",
            ExpressionAttributeNames: {
                "#date": util.getAttendanceFieldName(date)
            },
            ExpressionAttributeValues: {
                ":attendace": isAttendance
            },
            ReturnValues: 'NONE'
        };
        await this.db.update(param).promise();
    }
}