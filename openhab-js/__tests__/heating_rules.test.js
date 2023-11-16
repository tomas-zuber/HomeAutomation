import {ItemMap} from "../classes";
import {
    AIR_HEAT_SWITCH,
    HEATER_SWITCH,
    BOILER_SWITCH,
    AIR_POWER_LIMIT,
    HEATER_POWER_LIMIT,
    BOILER_POWER_LIMIT,
    OFF,
    ON,
    POWER_MAX_CONSUMPTION,
    updateHeating
} from "../heating_rules";
import {describe, expect, it} from '@jest/globals';

const AIR_OK_POWER = AIR_POWER_LIMIT
const AIR_LOW_POWER = AIR_POWER_LIMIT + 1

const HEATER_OK_POWER = HEATER_POWER_LIMIT
const HEATER_LOW_POWER = HEATER_POWER_LIMIT + 1

const BOILER_OK_POWER = BOILER_POWER_LIMIT
const BOILER_LOW_POWER = BOILER_POWER_LIMIT + 1

const CONSUMING_POWER = POWER_MAX_CONSUMPTION + 1

function itemMap(powerSum) {
    return new ItemMap(powerSum);
}

function autoOn(power) {
    return itemMap(power).airAuto(ON).heaterAuto(ON).boilerAuto(ON);
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
            expect(items.getItem(HEATER_SWITCH).spy).toBeCalledTimes(0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            // OFF
            [itemMap(HEATER_LOW_POWER).heaterAuto(ON).heaterStatus(OFF), false, OFF],
            [itemMap(CONSUMING_POWER).heaterAuto(ON).heaterStatus(OFF), false, OFF],
            [itemMap(HEATER_OK_POWER).heaterAuto(ON).heaterStatus(OFF), true, ON],

            // ON
            [itemMap(HEATER_LOW_POWER).heaterAuto(ON).heaterStatus(ON), false, ON],
            [itemMap(CONSUMING_POWER).heaterAuto(ON).heaterStatus(ON), true, OFF],

            // auto OFF
            [itemMap(HEATER_OK_POWER).heaterAuto(OFF).heaterStatus(OFF), false, OFF],
            [itemMap(HEATER_OK_POWER).heaterAuto(OFF).heaterStatus(ON), true, OFF],
            [itemMap(CONSUMING_POWER).heaterAuto(OFF).heaterStatus(ON), true, OFF],
        ])('updateHeating for heater %p updated %p and status %p', (items, updated, newState) => {
            updateHeating(items)

            expect(items.getItem(HEATER_SWITCH).spy).toBeCalledTimes(updated ? 1 : 0);
            expect(items.getItem(HEATER_SWITCH).rawState).toEqual(newState);
            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(0);
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
            expect(items.getItem(HEATER_SWITCH).spy).toBeCalledTimes(0);
        });

        it.each([
            // air OFF & heater OFF & boiler OFF
            [autoOn(AIR_LOW_POWER)
                .airStatus(OFF).heaterStatus(OFF).boilerStatus(OFF),
                false, false, OFF, false, OFF],
            [autoOn(AIR_OK_POWER + HEATER_OK_POWER + CONSUMING_POWER)
                .airStatus(OFF).heaterStatus(OFF).boilerStatus(OFF),
                true, false, OFF, false, OFF],
            [autoOn(AIR_OK_POWER + HEATER_OK_POWER + BOILER_OK_POWER + CONSUMING_POWER)
                .airStatus(OFF).heaterStatus(OFF).boilerStatus(OFF),
                true, true, ON, false, OFF],
            [autoOn(AIR_OK_POWER + HEATER_OK_POWER + BOILER_OK_POWER)
                .airStatus(OFF).heaterStatus(OFF),
                true, true, ON, true, ON],

            // air ON & heater ON & boiler ON
            [autoOn(AIR_LOW_POWER).airStatus(ON).heaterStatus(ON).boilerStatus(ON),
                false, false, ON, false, ON],
            [autoOn(CONSUMING_POWER).airStatus(ON).heaterStatus(ON).boilerStatus(ON),
                false, false, ON, true, OFF],
            [autoOn(CONSUMING_POWER - BOILER_OK_POWER).airStatus(ON).heaterStatus(ON).boilerStatus(ON),
                false, true, OFF, true, OFF],
            [autoOn(CONSUMING_POWER - BOILER_OK_POWER - HEATER_OK_POWER).airStatus(ON).heaterStatus(ON).boilerStatus(ON),
                true, true, OFF, true, OFF],

            // air ON & heater OFF & boiler OFF
            [autoOn(HEATER_LOW_POWER).airStatus(ON).heaterStatus(OFF).boilerStatus(OFF),
                false, false, OFF, false, OFF],
            [autoOn(HEATER_OK_POWER).airStatus(ON).heaterStatus(OFF).boilerStatus(OFF),
                false, true, ON, false, OFF],
            [autoOn(CONSUMING_POWER).airStatus(ON).heaterStatus(OFF).boilerStatus(OFF),
                true, false, OFF, false, OFF],

            // air OFF & heater ON & boiler OFF
            [autoOn(AIR_LOW_POWER).airStatus(OFF).heaterStatus(ON).boilerStatus(OFF),
                false, false, ON, false, OFF], // wrong, but can happen only if airAuto is turned OFF and ON
            [autoOn(AIR_OK_POWER).airStatus(OFF).heaterStatus(ON).boilerStatus(OFF),
                true, false, ON, false, OFF],
            [autoOn(CONSUMING_POWER - HEATER_OK_POWER).airStatus(OFF).heaterStatus(ON).boilerStatus(OFF),
                false, true, OFF, false, OFF],
            [autoOn(CONSUMING_POWER).airStatus(OFF).heaterStatus(ON).boilerStatus(OFF),
                true, true, OFF, false, OFF],

            // air OFF & heater OFF & boiler ON
            [autoOn(AIR_LOW_POWER).airStatus(OFF).heaterStatus(OFF).boilerStatus(ON),
                false, false, OFF, false, ON], // wrong, but can happen only if airAuto and heaterAuto is turned OFF and ON
            [autoOn(AIR_OK_POWER).airStatus(OFF).heaterStatus(OFF).boilerStatus(ON),
                true, false, OFF, false, ON],
            [autoOn(CONSUMING_POWER - BOILER_OK_POWER).airStatus(OFF).heaterStatus(OFF).boilerStatus(ON),
                false, false, OFF, true, OFF],
            [autoOn(CONSUMING_POWER).airStatus(OFF).heaterStatus(OFF).boilerStatus(ON),
                false, true, ON, true, OFF], // TODO? wrong

        ])('updateHeating for air & heater & boiler %p', (items, airUpdated, heaterUpdated, heaterNewState, boilerUpdated, boilerNewState) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(airUpdated ? 1 : 0);
            expect(items.getItem(HEATER_SWITCH).spy).toBeCalledTimes(heaterUpdated ? 1 : 0);
            expect(items.getItem(HEATER_SWITCH).rawState).toEqual(heaterNewState);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(boilerUpdated ? 1 : 0);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(boilerNewState);
        });
    }
)
