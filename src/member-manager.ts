import StorageDriver from './drivers/storage-driver';
import Env from './env';
import { SlackUser, User } from './models';

export default class {
    protected storageDriver: StorageDriver;

    constructor(env: Env) {
        this.storageDriver = new StorageDriver(env);
    }

    async updateAttendanceOrNot(user:SlackUser, date:Date) {
        const userData = await this.storageDriver.getUser(user.id);
        const dstValue = !userData.isAttendance(date);
        await this.storageDriver.updateUserAttedance(user.id, date, dstValue);
    }

    async getMembersWith(candidates: Date[]): Promise<User[]> {
        return await this.storageDriver.scanUsers(candidates);
    }

    async getAttendaceMembers(date: Date): Promise<User[]> {
        const users = await this.storageDriver.scanUsers([date]);
        return users.filter(user => user.isAttendance(date));
    }
}