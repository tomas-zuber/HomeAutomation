import {ItemMap} from "../classes";
import {
    AIR_HEAT_SWITCH,
    AIR_POWER_LIMIT,
    BOILER_POWER_LIMIT,
    BOILER_SWITCH,
    OFF,
    ON,
    updateHeating
} from "../heating_rules";
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

            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(OFF), false],
            [itemMap(AIR_OK_POWER).airAuto(OFF).airStatus(ON), true],
            [itemMap(AIR_LOW_POWER).airAuto(OFF).airStatus(ON), true],
        ])('updateHeating for air %p updated %p', (items, updated) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            [itemMap(BOILER_OK_POWER).boilerAuto(ON).boilerStatus(OFF), true, ON],
            [itemMap(BOILER_LOW_POWER).boilerAuto(ON).boilerStatus(ON), true, OFF],
            [itemMap(BOILER_LOW_POWER).boilerAuto(ON).boilerStatus(OFF), false, OFF],
            [itemMap(BOILER_OK_POWER).boilerAuto(ON).boilerStatus(ON), false, ON],

            [itemMap(BOILER_OK_POWER).boilerAuto(OFF).boilerStatus(OFF), false, OFF],
            [itemMap(BOILER_OK_POWER).boilerAuto(OFF).boilerStatus(ON), true, OFF],
            [itemMap(BOILER_LOW_POWER).boilerAuto(OFF).boilerStatus(ON), true, OFF],

        ])('updateHeating for boiler %p updated %p and status %p', (items, updated, newState) => {
            updateHeating(items)

            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(newState);
            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            // enough power for both
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(OFF),
                true, true, ON],
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER)
                .airAuto(ON).airStatus(ON)
                .boilerAuto(ON).boilerStatus(OFF),
                false, true, ON],
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(ON),
                true, false, ON],
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER)
                .airAuto(ON).airStatus(ON)
                .boilerAuto(ON).boilerStatus(ON),
                false, false, ON],

            // enough power for only 1
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER + 1)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(OFF),
                true, false, OFF],
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER + 1)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(ON),
                true, true, OFF],
            [itemMap(AIR_OK_POWER + BOILER_OK_POWER + 1)
                .airAuto(ON).airStatus(ON)
                .boilerAuto(ON).boilerStatus(OFF),
                false, true, ON],

            // low power
            [itemMap(0)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(OFF),
                false, false, OFF],
            [itemMap(0)
                .airAuto(ON).airStatus(ON)
                .boilerAuto(ON).boilerStatus(OFF),
                true, false, OFF],
            [itemMap(0)
                .airAuto(ON).airStatus(OFF)
                .boilerAuto(ON).boilerStatus(ON),
                false, true, OFF],
            [itemMap(0)
                .airAuto(ON).airStatus(ON)
                .boilerAuto(ON).boilerStatus(ON),
                true, true, OFF],

        ])('updateHeating for air & boiler %p', (items, airUpdated, boilerUpdated, boilerNewState) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(airUpdated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(boilerUpdated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(boilerNewState);
        });
    }
)
