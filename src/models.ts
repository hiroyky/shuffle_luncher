import * as StorageUtil from './drivers/storage-util';

export interface AskEvent {
    /** 開催年 */
    heldYear?: number;

    /** 開催月(js式 1月が0, 12月が11) */
    heldMonth?: number;

    /** 開催曜日(js式 日曜が0, 土曜が6) */
    heldDay: number;

    /** アンケートの回答期限 */
    answerExpires: string;
}

export interface ShuffleEvent {
    /** 開催年 */
    heldYear?: number;

    /** 開催月(js式 1月が0, 12月が11) */
    heldMonth?: number;

    /** 開催曜日(js式 日曜が0, 土曜が6) */
    heldDay: number;

    heldNum?: number;

    unit?: number;
}

export class HttpError extends Error {
    statusCode: number;
    constructor(statusCode:number, message:string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export interface InteractiveMessagePayload {
    type: string,
    actions: Array<{name: string, type: string, value:string}>,
    callback_id: string,
    team: {id : string, domain:string},
    channel: {id: string, name: string},
    user: SlackUser,
    action_ts: string,
    message_ts: string,
    attachment_id: string,
    token: string,
    is_app_unfurl: boolean,
    original_message: OriginalMessage
    response_url: string,
    tirigger_id: string
}

export interface SlackUser {
    id: string;
    name: string;
}

export interface OriginalMessage {
    text?: string,
    username: string,
    bot_id: string,
    attachments?: Attachment[],
    type: string,
    subtype: string,
    ts: string
}

export interface Attachment {
    callback_id: string;
    title?: string;
    text?: string;
    fallback?: string;
    actions?: any[];
    footer?: string;
    ts?: number;
}

interface IUser {
    slackId: string;
    name: string;
    displayName?: string;
}

export class User implements IUser {
    protected data: {[key:string]:any};

    get slackId(): string {
        return this.data.slack_id;
    }

    get name(): string {
        return this.data.name;
    }

    get displayName(): string|undefined {
        return this.data.display_name;
    }

    constructor(data: {[key:string]:any}) {
        this.data = data;
    }

    isAttendance(date:Date): boolean {
        const val = this.data[StorageUtil.getAttendanceFieldName(date)];
        return val === true;
    }

    countAttedances(dates: Date[]): number {
        return dates.filter(d => this.isAttendance(d)).length;
    }
}

export interface UsersPerDate {
    heldDate: Date;
    users: User[];
}

export interface ParticipantGroup extends UsersPerDate {
    groupName: string;
}

export class ParticipantGroupList extends Array<ParticipantGroup> {
    heldDate: Date = new Date();
}

export class UsersPerDateList extends Array<UsersPerDate> {
    countUserParticipant(user:User): number {
        return this.filter(val => 
            val.users.findIndex((el, i, arr) => 
                el.slackId === user.slackId) >= 0
        ).length;
    }
}