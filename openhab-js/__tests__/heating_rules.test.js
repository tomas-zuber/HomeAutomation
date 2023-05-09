import {ItemMap} from "../classes";
import {AIR_HEAT_SWITCH, AIR_POWER_LIMIT, BOILER_POWER_LIMIT, OFF, ON, updateHeating} from "../heating_rules";
import {describe, expect, it} from '@jest/globals';

const AIR_OK_POWER = AIR_POWER_LIMIT
const AIR_LOW_POWER = AIR_POWER_LIMIT + 1
const BOILER_OK_POWER = BOILER_POWER_LIMIT
const BOILER_LOW_POWER = BOILER_POWER_LIMIT + 1

function itemMap(powerSum) {
    return new ItemMap(powerSum);
}

describe('updateHeating tests', () => {
        it.each([
            [itemMap(AIR_OK_POWER).airAuto(ON).airStatus(OFF), true],
            [itemMap(AIR_LOW_POWER).airAuto(ON).airStatus(ON), true],
            [itemMap(AIR_LOW_POWER).airAuto(ON).airStatus(OFF), false],
            [itemMap(AIR_OK_POWER).airAuto(ON).airStatus(ON), false],

            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(OFF, OFF), false],
            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(ON, OFF), true],
            [itemMap(AIR_LOW_POWER).airAuto(OFF).airStatus(ON, OFF), true],
        ])('updateHeating %p expecting %p', (items, updated) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
        });
        /*it.each([
            // airHeatAuto = OFF, boilerAuto = ON
            [createAirHeatItemMap(AIR_OK_POWER, OFF, OFF).addItems(createBoilerItemMap(OFF, ON)), 1, ON],

            // airHeatAuto = OFF, boilerAuto = OFF
        ])('updateHeating %p expecting %p and stat %p', (items, callCount, endState) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(callCount);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(endState);
        });*/
    }
)
