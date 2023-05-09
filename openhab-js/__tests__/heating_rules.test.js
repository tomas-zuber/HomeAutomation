import {Item, ItemMap} from "../classes";
import {
    AIR_HEAT_AUTO,
    AIR_HEAT_STATUS,
    AIR_HEAT_SWITCH,
    AIR_POWER_LIMIT,
    OFF,
    ON,
    POWER_SUM,
    updateHeating
} from "../heating_rules";
import {describe, expect, it, jest, test} from '@jest/globals';

const AIR_HEAT_ENOUGH_POWER = AIR_POWER_LIMIT
const AIR_HEAT_LOW_POWER = -449

function createItems(powerSum, airHeatStatus, airHeatAuto = ON) {
    const items = new ItemMap();
    items.addItem(POWER_SUM, new Item(powerSum));
    items.addItem(AIR_HEAT_STATUS, new Item(airHeatStatus));
    items.addItem(AIR_HEAT_AUTO, new Item(airHeatAuto));

    let airHeatSwitch = new Item();
    airHeatSwitch.spy = jest.spyOn(airHeatSwitch, 'sendCommand')
    items.addItem(AIR_HEAT_SWITCH, airHeatSwitch);
    return items;
}

describe('updateHeating tests', () => {
        it.each([
            // airHeatAuto = ON
            [createItems(AIR_HEAT_ENOUGH_POWER, OFF), 1],
            [createItems(AIR_HEAT_LOW_POWER, ON), 1],
            [createItems(AIR_HEAT_LOW_POWER, OFF), 0],
            [createItems(AIR_HEAT_ENOUGH_POWER, ON), 0],

            // airHeatAuto = OFF
            [createItems(AIR_HEAT_ENOUGH_POWER, OFF, OFF), 0],
            [createItems(AIR_HEAT_ENOUGH_POWER, ON, OFF), 1],
            [createItems(AIR_HEAT_LOW_POWER, ON, OFF), 1],
        ])('updateHeating %p expecting %p', (items, callCount) => {
            updateHeating(items)

            expect(items.getItem(AIR_HEAT_SWITCH).spy).toBeCalledTimes(callCount);
        });
    }
)
