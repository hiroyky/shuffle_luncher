import { assert } from 'chai';
import * as sinon from 'sinon';
import * as lib from '../src/lib';
import * as util from '../src/drivers/storage-util';
import { User } from '../src/models';

describe('getHeldDates', () => {
    it('2018年４月の火曜日', () => {
        const actual = lib.getHeldDates(2018, 3, 2);
        const expected = [
            new Date(2018, 3, 3), 
            new Date(2018, 3, 10),
            new Date(2018, 3, 17), 
            new Date(2018, 3, 24)
        ];
        assert.deepEqual(actual, expected);
    });
});

describe('divideParticipantDates', () => {
    it('全員が全日出席できる．', () => {
        const heldDates = [
            new Date(Date.UTC(2018, 4, 1)),
            new Date(Date.UTC(2018, 4, 8)),
            new Date(Date.UTC(2018, 4, 15)),
            new Date(Date.UTC(2018, 4, 22)),
            new Date(Date.UTC(2018, 4, 29))
        ];
        const users = new Array<User>(11);
        for(let i = 0; i < users.length; ++i) {
            const data:any = {
                slack_id: `id${i}`
            };
            heldDates.forEach(date => {
                const field = util.getAttendanceFieldName(date);
                data[field] = true;
            });
            users[i] = new User(data);
        }

        const actual = lib.divideParticipantDates(users, heldDates, 2);
        actual.forEach(val => {
            console.log(val.heldDate);
            console.log(val.users.map(u => u.slackId));
        });
    });
    it('一部のメンバが，基準日数以下しか出席できない', () => {
        const heldDates = [
            new Date(Date.UTC(2018, 4, 1)),
            new Date(Date.UTC(2018, 4, 8)),
            new Date(Date.UTC(2018, 4, 15)),
            new Date(Date.UTC(2018, 4, 22)),
            new Date(Date.UTC(2018, 4, 29))
        ];
        const users = new Array<User>(1);
        const data0:any = {slack_id: 'id0'};
        data0[util.getAttendanceFieldName(heldDates[0])] = true;
        users[0] = new User(data0);
        const actual = lib.divideParticipantDates(users, heldDates, 2);
        actual.forEach(val => {
            console.log(val.heldDate);
            console.log(val.users.map(u => u.slackId));
        });
    });
});

describe('divideIntoGroups', () => {
    it('等分割されている', () => {
        const src = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        const actual = lib.divideIntoGroups(src, 3);
        const expected = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
        assert.deepEqual(actual, expected);
    });
    it('あまりが先頭の配列に追加されている', () => {
        const src = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const actual = lib.divideIntoGroups(src, 3);
        const expected = [['a', 'b', 'c', 'j'], ['d', 'e', 'f'], ['g', 'h', 'i']];
        assert.deepEqual(actual, expected);
    });
    it('あまりが先頭の配列から順に追加されている', () => {
        const src = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
        const actual = lib.divideIntoGroups(src, 3);
        const expected = [['a', 'b', 'c', 'j'], ['d', 'e', 'f', 'k'], ['g', 'h', 'i']];
        assert.deepEqual(actual, expected);
    });
    it('分割すべき要素数がない', () => {
        const src = ['a', 'b', 'c'];
        const actual = lib.divideIntoGroups(src, 3);
        const expected = [['a', 'b', 'c']];
        assert.deepEqual(actual, expected);
    });
    it('分割単位より要素数が少ない', () => {
        const src = ['a', 'b'];
        const actual = lib.divideIntoGroups(src, 3);
        const expected = [['a', 'b']];
        assert.deepEqual(actual, expected);
    });
    it('最後の数の要素数と分割', () => {
        const src =  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
        const actual = lib.divideIntoGroups(src, 5);
        const expected = [['a', 'b', 'c', 'd', 'e'],['f', 'g', 'h','i', 'j'], ['k', 'l', 'm', 'n', 'o'], ['p','q', 'r', 's']];
        assert.deepEqual(actual, expected);
    });
});