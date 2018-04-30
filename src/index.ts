import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { AskEvent, ShuffleEvent, ParticipantGroupList } from "./models";
import Env from './env';
import SlackDriver from './drivers/slack-driver';
import MemberManager from './member-manager';
import * as lib from './lib';
import * as conf from './conf';
import SlackPayloadParser from './slack-payload-parser';

const env = new Env();
const slackDriver = new SlackDriver(env);
const memberManager = new MemberManager(env);

export async function askForAttendanceDates(event: AskEvent) {
    try{
        await env.init();
        const date = new Date();
        const heldYear = event.heldYear ? event.heldYear : date.getFullYear();
        const heldMonth = event.heldMonth ? event.heldMonth : date.getMonth() + 1;
        const heldDates = lib.getHeldDates(heldYear, heldMonth, event.heldDay);
        slackDriver.askForAttendanceDates(heldDates, event.answerExpires);
    } catch(err) {
        console.error(err);
    }
}

export async function interactoinHandler(event: APIGatewayEvent, context: Context, callback: Callback) {
    try {
        await env.init();
        const req = new SlackPayloadParser(event);
        await memberManager.updateAttendanceOrNot(req.eventTriggeredUser, req.eventTriggeredDate);
        const attendanceUsers = await memberManager.getAttendaceMembers(req.eventTriggeredDate);
        console.log(attendanceUsers);
        slackDriver.updateAttedanceMembers(attendanceUsers, req.eventTriggeredDate, req.originalMessage);
        callback(null, {
            statusCode: '200',
            headers: { 'Content-Type': 'application/json' },
            body: ''
        });
    } catch(err) {
        console.error(err);
    }
}

export async function shuffleMembers(event: ShuffleEvent) {
    try {
        await env.init();
        const date = new Date();
        const heldYear = event.heldYear ? event.heldYear : date.getFullYear();
        const heldMonth = event.heldMonth ? event.heldMonth : date.getMonth();
        const heldDates = lib.getHeldDates(heldYear, heldMonth, event.heldDay);
        const heldNum = event.heldNum ? event.heldNum : 2;
        const unit = event.unit ? event.unit : 6;
        const users = await memberManager.getMembersWith(heldDates);
        const schedule = lib.divideParticipantDates(users, heldDates, heldNum);
        const groupList = schedule.map(s => {
            const groups = lib.nameGropus(lib.groupMembers(s, unit), conf.GroupNames);
            const groupList = new ParticipantGroupList(...groups);
            groupList.heldDate = s.heldDate;
            return groupList;
        });
        slackDriver.notifyGropus(groupList);

    } catch(err) {
        console.error(err);
    }
}
