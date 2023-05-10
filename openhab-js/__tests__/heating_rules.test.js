import {ItemMap} from "../classes";
import {
    AIR_HEAT_SWITCH,
    AIR_POWER_LIMIT,
    BOILER_POWER_LIMIT,
    BOILER_SWITCH,
    OFF,
    ON,
    POWER_MAX_CONSUMPTION,
    updateHeating
} from "../heating_rules";
import {describe, expect, it} from '@jest/globals';

const AIR_OK_POWER = AIR_POWER_LIMIT
const AIR_LOW_POWER = AIR_POWER_LIMIT + 1
const BOILER_OK_POWER = BOILER_POWER_LIMIT
const BOILER_LOW_POWER = BOILER_POWER_LIMIT + 1
const CONSUMING_POWER = POWER_MAX_CONSUMPTION + 1

function itemMap(powerSum) {
    return new ItemMap(powerSum);
}

function autoOn(power) {
    return itemMap(power).airAuto(ON).boilerAuto(ON);
}

describe('updateHeating tests', () => {
        it.each([
            // OFF
            [itemMap(AIR_LOW_POWER).airAuto(ON).airStatus(OFF), false],
            [itemMap(CONSUMING_POWER).airAuto(ON).airStatus(OFF), false],
            [itemMap(AIR_OK_POWER).airAuto(ON).airStatus(OFF), true],

            // ON
            [itemMap(AIR_LOW_POWER).airAuto(ON).airStatus(ON), false],
            [itemMap(CONSUMING_POWER).airAuto(ON).airStatus(ON), true],

            // auto OFF
            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(OFF), false],
            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(ON), true],
            [itemMap(CONSUMING_POWER).airAuto(OFF).airStatus(ON), true],
        ])('updateHeating for air %p updated %p', (items, updated) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            // OFF
            [itemMap(BOILER_LOW_POWER).boilerAuto(ON).boilerStatus(OFF), false, OFF],
            [itemMap(CONSUMING_POWER).boilerAuto(ON).boilerStatus(OFF), false, OFF],
            [itemMap(BOILER_OK_POWER).boilerAuto(ON).boilerStatus(OFF), true, ON],

            // ON
            [itemMap(BOILER_LOW_POWER).boilerAuto(ON).boilerStatus(ON), false, ON],
            [itemMap(CONSUMING_POWER).boilerAuto(ON).boilerStatus(ON), true, OFF],

            // auto OFF
            [itemMap(BOILER_OK_POWER).boilerAuto(OFF).boilerStatus(OFF), false, OFF],
            [itemMap(BOILER_OK_POWER).boilerAuto(OFF).boilerStatus(ON), true, OFF],
            [itemMap(CONSUMING_POWER).boilerAuto(OFF).boilerStatus(ON), true, OFF],
        ])('updateHeating for boiler %p updated %p and status %p', (items, updated, newState) => {
            updateHeating(items)

            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(newState);
            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            // air OFF & boiler OFF
            [autoOn(AIR_LOW_POWER).airStatus(OFF).boilerStatus(OFF),
                false, false, OFF],
            [autoOn(AIR_OK_POWER).airStatus(OFF).boilerStatus(OFF),
                true, false, OFF],
            [autoOn(AIR_OK_POWER + BOILER_OK_POWER).airStatus(OFF).boilerStatus(OFF),
                true, true, ON],

            // air ON & boiler ON
            [autoOn(AIR_LOW_POWER).airStatus(ON).boilerStatus(ON),
                false, false, ON],
            [autoOn(CONSUMING_POWER).airStatus(ON).boilerStatus(ON),
                false, true, OFF],

            // air ON & boiler OFF
            [autoOn(BOILER_OK_POWER).airStatus(ON).boilerStatus(OFF),
                false, true, ON],

            // air OFF & boiler ON
            [autoOn(AIR_OK_POWER).airStatus(OFF).boilerStatus(ON),
                true, false, ON],
        ])('updateHeating for air & boiler %p', (items, airUpdated, boilerUpdated, boilerNewState) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(airUpdated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(boilerUpdated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(boilerNewState);
        });
    }
)
