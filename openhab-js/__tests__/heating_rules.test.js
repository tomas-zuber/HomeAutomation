import {Item, ItemMap} from "../classes";
import {AIR_HEAT_AUTO, AIR_HEAT_STATUS, AIR_HEAT_SWITCH, OFF, ON, POWER_SUM, updateHeating} from "../heating_rules";
import {expect, jest, test} from '@jest/globals';

const AIR_HEAT_ENOUGH_POWER = -450
const AIR_HEAT_LOW_POWER = -449

function createItems(powerSum, airHeatSwitch, airHeatAuto) {
    const items = new ItemMap();
    items.addItem(POWER_SUM, new Item(powerSum));
    items.addItem(AIR_HEAT_SWITCH, new Item(airHeatSwitch));
    items.addItem(AIR_HEAT_AUTO, new Item(airHeatAuto));
    return items;
}

/*
describe('updateHeating test', () => {
    it.each([
        createItems(AIR_HEAT_ENOUGH_POWER, OFF),
        [[1, 2, 39], 42],
        [[1, 2, NaN], NaN],
        [[1, 2, Infinity], Infinity],
    ])('adds %p expecting %p', (numbers: number[], result: number) => {
        expect(calculator('+', numbers)).toEqual(result);
    });*/

describe("updateHeating function", () => {

    test("air heater is OFF, powerSum is enough -> switch", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_ENOUGH_POWER));
        let airHeatSwitch = new Item();
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
        items.addItem(AIR_HEAT_STATUS, new Item(OFF));
        items.addItem(AIR_HEAT_AUTO, new Item(ON));

        updateHeating(items);

        expect(spy).toBeCalledTimes(1);
    });

    test("air heater is ON, powerSum is low -> switch", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_LOW_POWER));
        let airHeatSwitch = new Item();
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
        items.addItem(AIR_HEAT_STATUS, new Item(ON));

        updateHeating(items);

        expect(spy).toBeCalledTimes(1);
    });

    test("air heater is OFF, powerSum is low -> nothing", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_LOW_POWER));
        items.addItem(AIR_HEAT_STATUS, new Item(OFF));
        let airHeatSwitch = new Item();
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);

        updateHeating(items);

        expect(spy).toBeCalledTimes(0);
    });

    test("air heater is ON, powerSum is enough -> nothing", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_ENOUGH_POWER));
        items.addItem(AIR_HEAT_STATUS, new Item(ON));
        let airHeatSwitch = new Item();
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')

        updateHeating(items);

        expect(spy).toBeCalledTimes(0);
    });

});