import { UsersPerDate, User, UsersPerDateList, ParticipantGroup } from './models';
export function getHeldDates(year:number, month: number, day: number): Date[] {
    const firstDate = getFirstDateOfDay(year, month, day);
    const heldDates = new Array<Date>();
    for(const d = new Date(firstDate); d.getMonth() === month; d.setDate(d.getDate() + 7)) {
        heldDates.push(new Date(d));
    }
    return heldDates;
}

function getFirstDateOfDay(year:number, month: number, day: number): Date {
    const firstDate = new Date(year, month, 1);
    for(let d = 0; 0 < 7; ++d) {
        if(firstDate.getDay() === day) {
            return firstDate;
        }
        firstDate.setDate(firstDate.getDate() + 1);
    }
    throw new Error();
}

export function groupMembers(participants: UsersPerDate, unit:number): UsersPerDateList {
    const shuffledUsers = shuffleArray(participants.users, Math.random);
    const groups = divideIntoGroups(shuffledUsers, unit);
    const list = new UsersPerDateList();
    groups.forEach(g  => {
        list.push({heldDate: participants.heldDate, users: g});
    });
    return list;
}

export function nameGropus(groups: UsersPerDateList, names: string[]): ParticipantGroup[] {
    if(groups.length > names.length) {
        throw new Error(`groups length is ${groups.length}, more than names ${names.length}`);
    }
    const gropusWithName = new Array<ParticipantGroup>();
    for(let i = 0; i < groups.length; ++i) {
        gropusWithName.push({
            heldDate: groups[i].heldDate,
            users: groups[i].users,
            groupName: names[i]
        });
    }
    return gropusWithName;
}

export function divideParticipantDates(users: User[], heldDates: Date[], pnum:number): UsersPerDateList {
    const schedule = new UsersPerDateList();
    heldDates.forEach(date => schedule.push({heldDate: date, users:[]}));

    const sortedUsers = sortByAttedanceDates(users, heldDates);
    sortedUsers.forEach(user => {
        if(user.countAttedances(heldDates) <= pnum) {
            schedule.filter(held => user.isAttendance(held.heldDate)).forEach(held => held.users.push(user));
        } else {
            shuffleArray(schedule, Math.random).sort(sortByTheNumOfMembers).forEach(date => {
                if(user.isAttendance(date.heldDate) && schedule.countUserParticipant(user) < pnum) {
                    date.users.push(user);
                }
            });
        }
    });

    return schedule;
}

function sortByTheNumOfMembers(a: UsersPerDate, b: UsersPerDate): number {
    if(a.users.length < b.users.length) {
        return -1;
    }
    if(a.users.length > b.users.length) {
        return 1;
    }
    return 0;
}

function findUsersPerDate(heldDates: UsersPerDate[], date:Date): UsersPerDate {
    const match = heldDates.find((el, i, arr) => el.heldDate === date);
    if(match === undefined) {
        throw new Error();
    }
    return match;
}

function shuffleArray<T>(src: Array<T>, rand:() => number): Array<T> {
    const range = Array.from(Array(src.length), (v, k) => k);     
    const newArray = new Array<T>(src.length);
    for(const val of src) {
        const index = Math.floor(rand() * range.length);
        newArray[range[index]] = val;
        range.splice(index, 1);
    }
    return newArray;
}

export function divideIntoGroups<T>(array: Array<T>, unit:number): Array<Array<T>> {
    const theNumOfGroups = Math.floor(array.length / unit);
    const teams = new Array<Array<T>>(theNumOfGroups);
    for(let i = 0; i < array.length; ++i) {
        const index = Math.floor(i / unit);
        if(teams[index] === undefined) {
            teams[index] = new Array<T>();
        }
        teams[index].push(array[i]);
    }
    const tailTeam = teams[teams.length - 1];
    if(tailTeam === undefined) {
        return teams;
    } else if(tailTeam.length < unit && tailTeam.length < teams.length - 1) {
        const remainders = tailTeam;
        let teamIndex = 0;
        for(const r of remainders) {
            teams[teamIndex].push(r);
            ++teamIndex;
        }
        teams.pop();
    }
    return teams;
}

function sortByAttedanceDates(users: User[], candidates: Date[]): User[] {
    return users.sort((a, b) => {
        if(a.countAttedances(candidates) < b.countAttedances(candidates)) {
            return -1;
        }
        if(a.countAttedances(candidates) > b.countAttedances(candidates)) {
            return 1;
        }
        return 0;
    });
}