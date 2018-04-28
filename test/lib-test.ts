import { assert } from 'chai';
import * as lib from '../src/lib';

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