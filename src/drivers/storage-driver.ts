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
        if (result.Item === undefined) {
            throw new Error(`failed to get User ${param}`);
        }
        return new User(result.Item);
    }

    async scanUsers(dates: Date[] | undefined = undefined): Promise<User[]> {
        const param: DocumentClient.ScanInput = {
            TableName: this.env.dynamoDBTableName,
        };
        if (dates) {
            const attr: { [key: string]: string } = {};
            attr['#user'] = 'user';
            attr['#slack_id'] = 'slack_id';
            attr['#display_name'] = 'display_name';
            const projectionEx = new Array<string>(...Object.keys(attr));
            dates.forEach(d => {
                const attendaceField = `#${d.getTime() / 1000}at`;
                const teamField = `#${d.getTime() / 1000}nm`;
                attr[attendaceField] = util.getAttendanceFieldName(d);
                attr[teamField] = util.getTeamFieldName(d);
                projectionEx.push(attendaceField);
                projectionEx.push(teamField);
            });
            param.ExpressionAttributeNames = attr;
            param.ProjectionExpression = projectionEx.join(', ');
        }
        const result = await this.db.scan(param).promise();
        if (result.Items === undefined) {
            throw new Error(`failed to scan Users ${param}`);
        }
        return result.Items.map(item => new User(item));
    }

    async updateUserAttedance(slackId: string, date: Date, isAttendance: boolean) {
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