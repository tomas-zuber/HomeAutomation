import {Item, ItemMap} from "../classes";
import {
    AIR_HEAT_AUTO,
    AIR_HEAT_STATUS,
    AIR_HEAT_SWITCH,
    AIR_POWER_LIMIT,
    BOILER_AUTO,
    BOILER_POWER_LIMIT,
    BOILER_SWITCH,
    OFF,
    ON,
    updateHeating
} from "../heating_rules";
import {describe, expect, it, jest} from '@jest/globals';

const AIR_HEAT_ENOUGH_POWER = AIR_POWER_LIMIT
const AIR_HEAT_LOW_POWER = AIR_POWER_LIMIT + 1
const BOILER_ENOUGH_POWER = BOILER_POWER_LIMIT
const BOILER_LOW_POWER = BOILER_POWER_LIMIT + 1

function createAirHeatItemMap(powerSum, airHeatStatus, airHeatAuto = ON) {
    const itemMap = new ItemMap();
    itemMap.power(powerSum);
    itemMap.addItem(AIR_HEAT_STATUS, new Item(airHeatStatus));
    itemMap.addItem(AIR_HEAT_AUTO, new Item(airHeatAuto));

    let airHeatSwitch = new Item();
    airHeatSwitch.spy = jest.spyOn(airHeatSwitch, 'sendCommand')
    itemMap.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
    return itemMap;
}

function createBoilerItemMap(boilerStatus, boilerAuto = ON) {
    const items = new ItemMap();
    items.addItem(BOILER_AUTO, new Item(boilerAuto));

    let boilerSwitch = new Item(boilerStatus);
    boilerSwitch.spy = jest.spyOn(boilerSwitch, 'sendCommand')
    items.addItem(BOILER_SWITCH, boilerSwitch);
    return items;
}

describe('updateHeating tests', () => {
        it.each([
            // airHeatAuto = ON
            [createAirHeatItemMap(AIR_HEAT_ENOUGH_POWER, OFF), 1],
            [createAirHeatItemMap(AIR_HEAT_LOW_POWER, ON), 1],
            [createAirHeatItemMap(AIR_HEAT_LOW_POWER, OFF), 0],
            [createAirHeatItemMap(AIR_HEAT_ENOUGH_POWER, ON), 0],

            // airHeatAuto = OFF
            [createAirHeatItemMap(AIR_HEAT_ENOUGH_POWER, OFF, OFF), 0],
            [createAirHeatItemMap(AIR_HEAT_ENOUGH_POWER, ON, OFF), 1],
            [createAirHeatItemMap(AIR_HEAT_LOW_POWER, ON, OFF), 1],
        ])('updateHeating %p expecting %p', (items, callCount) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(callCount);
        });
        /*it.each([
            // airHeatAuto = OFF, boilerAuto = ON
            [createAirHeatItemMap(AIR_HEAT_ENOUGH_POWER, OFF, OFF).addItems(createBoilerItemMap(OFF, ON)), 1, ON],

            // airHeatAuto = OFF, boilerAuto = OFF
        ])('updateHeating %p expecting %p and stat %p', (items, callCount, endState) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(0);
            expect(items.getItem(BOILER_SWITCH).spy).toBeCalledTimes(callCount);
            expect(items.getItem(BOILER_SWITCH).rawState).toEqual(endState);
        });*/
    }
)
