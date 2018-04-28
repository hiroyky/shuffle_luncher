import { WebClient, ChatPostMessageArguments, ChatUpdateArguments } from '@slack/client';
import Env from '../env';
import { User, OriginalMessage, Attachment } from '../models';

export default class {
    protected web = new WebClient();
    protected env: Env;

    constructor(env: Env) {
        this.env = env;
    }

    async askForAttendanceDates(candidateDates: Date[], expires: string) {
        const arg = {
            token: this.env.slackToken,
            channel: this.env.slackChannelId,
            text: `シャッフルランチ出席可能日確認：出席できる日のボタンを全て押してください．${expires}まで`,
            fallback: '',
            attachments: new Array<any>()
        };
        candidateDates.forEach(date => {
            arg.attachments.push({
                callback_id: (date.getTime() / 1000).toString(),
                title: `${date.getMonth()+1}月${date.getDate()}日`,
                attachment_type: 'default',
                actions: [
                    {
                        type: 'button', 
                        text: '出席できる', 
                        name: `attendance_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    }
                ]
            });
            arg.attachments.push({
                callback_id: this.getAttachmentId(date),
                text: ''
            });
        });

        this.postMessage(arg);
    }

    async updateAttedanceMembers(attedanceMembers: User[], date: Date, org: OriginalMessage) {
        const arg: any = Object.assign({}, org, {
            token: this.env.slackToken,
            channel: this.env.slackChannelId
        });
        const attachments = arg.attachments as Attachment[];
        const index = attachments.findIndex((el, i, arr) => el.callback_id === this.getAttachmentId(date));
        attachments[index] = {
            text: `${attedanceMembers.map(m => m.displayName ? m.displayName : m.name).join(', ')}`,
            callback_id: attachments[index].callback_id,
        };
        this.update(arg);
    }

    protected async postMessage(arg: ChatPostMessageArguments) {
        return await this.web.chat.postMessage(arg);
    }

    protected async update(arg: ChatUpdateArguments) {
        return await this.web.chat.update(arg);
    }

    protected getAttachmentId(date:Date): string {
        return  `members-${(date.getTime() / 1000)}`;
    }
}