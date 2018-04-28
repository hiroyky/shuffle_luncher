import { APIGatewayEvent } from 'aws-lambda';
import { InteractiveMessagePayload, SlackUser, Attachment, HttpError, OriginalMessage } from './models';

export default class {
    protected req: InteractiveMessagePayload;

    constructor(event: APIGatewayEvent) {
        this.req = this.geSlacktPayload(event);
    }

    get eventTriggeredUser(): SlackUser {
        return this.req.user;
    }

    get eventTriggeredDate(): Date {
        const clickedUnixTime = parseInt(this.req.callback_id);
        return new Date(clickedUnixTime * 1000);
    }

    get originalMessage(): OriginalMessage {
        return this.req.original_message;
    }

    protected geSlacktPayload(event: APIGatewayEvent): InteractiveMessagePayload {
        const body = event.body;
        if(body === null) {
            throw new HttpError(400, "request body is null");
        }
        const payload = body.split('&').map((param) => {
            const keyValue = param.split('=');
            return {key: keyValue[0], value: keyValue[1]};
        }).filter((keyValue) => keyValue.key === 'payload')[0].value;
        
        return JSON.parse(decodeURIComponent(payload)) as InteractiveMessagePayload;
    }
}