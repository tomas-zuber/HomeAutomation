import {Item, ItemMap} from "../classes";
import {AIR_HEAT_SWITCH, OFF, ON, POWER_SUM, updateHeating} from "../heating_rules";
import expect from "expect";

describe("updateHeating function", () => {
    test("turn on air heater if turned off and powerSum is enough", () => {
        const items = new ItemMap();
        items.addItem(POWER_SUM, new Item(-1000));
        items.addItem(AIR_HEAT_SWITCH, new Item(OFF));

        updateHeating(items);

        expect(items.getItem(AIR_HEAT_SWITCH).rawState).toEqual(ON);
    });
});