import SsmDriver from './drivers/ssm-driver';
export default class {
    protected ssm = new SsmDriver();
    protected _slackToken: string = "";
    protected _slackChannnelId: string = "";
    protected _dynamoDBTableName: string = "";
    protected _theBaseNumberOfGroupMembers = 0;
    protected _theDayOfWeek = 0;
    protected _theDeadlineDayOfWeek = 0;

    get slackToken(): string {
        return this._slackToken;
    }

    get slackChannelId(): string {
        return this._slackChannnelId;
    }

    get dynamoDBTableName(): string {
        return this._dynamoDBTableName;
    }

    get theBaseNumberOfGroupMembers(): number {
        return this._theBaseNumberOfGroupMembers;
    }

    get theDayOfWeek(): number {
        return this._theDayOfWeek;
    }

    get theDeadlineDayOfWeek(): number {
        return this._theDeadlineDayOfWeek;
    }

    async init() {
        this._slackToken = await this.ssm.getParameter('shuffle_luncher_slack_token	', true);
        this._slackChannnelId = this.getEnv('SLACK_CHANNEL_ID');
        this._dynamoDBTableName = this.getEnv('DYNAMODB_TABLE_NAME');
        this._theBaseNumberOfGroupMembers = parseInt(this.getEnv('THE_BASE_NUMBER_OF_GROUP_MEMBERS'));
        this._theDayOfWeek = parseInt(this.getEnv('THE_DAY_OF_WEEK'));
        this._theDeadlineDayOfWeek = parseInt(this.getEnv('THE_DEADLINE_DAY_OF_WEEK'));
    }

    protected getEnv(key: string): string {
        const val = process.env[key];
        if(val === undefined) {
            throw new Error(`env: ${key} is undefined`);
        }
        return val;
    }
}
