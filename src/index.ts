import { AskEvent } from "./models";
import Env from './env';
import SlackDriver from './drivers/slack-driver';
import * as lib from './lib';

const env = new Env();
const slackDriver = new SlackDriver(env);

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

export async function interactoinHandler() {

}

export async function shuffleMembers() {
    
}