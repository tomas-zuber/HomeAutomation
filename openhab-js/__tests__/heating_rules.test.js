import {Item, ItemMap} from "../classes";
import {AIR_HEAT_SWITCH, AIR_POWER_LIMIT, OFF, ON, POWER_SUM, updateHeating} from "../heating_rules";
import {expect, jest, test} from '@jest/globals';

const AIR_HEAT_ENOUGH_POWER = -450
const AIR_HEAT_LOW_POWER = -449

describe("updateHeating function", () => {

    test("air heater is OFF, powerSum is enough -> turn ON", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_ENOUGH_POWER));
        items.addItem(AIR_HEAT_SWITCH, new Item(OFF));

        updateHeating(items);

        expect(items.getItem(AIR_HEAT_SWITCH).rawState).toEqual(ON);
    });

    test("air heater is ON, powerSum is low -> turn OFF", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_LOW_POWER));
        items.addItem(AIR_HEAT_SWITCH, new Item(ON));

        updateHeating(items);

        expect(items.getItem(AIR_HEAT_SWITCH).rawState).toEqual(OFF);
    });

    test("air heater is OFF, powerSum is low -> nothing", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_LOW_POWER));
        let airHeatSwitch = new Item(OFF);
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')

        updateHeating(items);

        expect(items.getItem(AIR_HEAT_SWITCH).rawState).toEqual(OFF);
        expect(spy).toBeCalledTimes(0);
    });

    test("air heater is ON, powerSum is enough -> nothing", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(AIR_HEAT_ENOUGH_POWER));
        let airHeatSwitch = new Item(ON);
        items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
        const spy = jest.spyOn(airHeatSwitch, 'sendCommand')

        updateHeating(items);

        expect(items.getItem(AIR_HEAT_SWITCH).rawState).toEqual(ON);
        expect(spy).toBeCalledTimes(0);
    });

});