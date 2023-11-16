import {
    AIR_HEAT_AUTO,
    AIR_HEAT_STATUS,
    AIR_HEAT_SWITCH,
    HEATER_AUTO,
    HEATER_SWITCH,
    OFF,
    POWER_SUM
} from "./heating_rules";
import {jest} from "@jest/globals";

export class ItemMap {
    values = new Map();

    constructor(power = 0) {
        this.power(power)
        let airHeatSwitch = new Item();
        airHeatSwitch.spy = jest.spyOn(airHeatSwitch, 'sendCommand')
        this.addItem(AIR_HEAT_SWITCH, airHeatSwitch);

        this.airStatus(OFF);
        this.airAuto(OFF);
        this.heaterStatus(OFF)
        this.heaterAuto(OFF)
    }

    addItem(name, value) {
        this.values.set(name, value);
    }

    getItem(name) {
        return this.values.get(name);
    }

    power(value) {
        this.addItem(POWER_SUM, new Item(value));
        return this;
    }

    airStatus(value) {
        this.addItem(AIR_HEAT_STATUS, new Item(value));
        return this;
    }

    airAuto(value) {
        this.addItem(AIR_HEAT_AUTO, new Item(value));
        return this;
    }

    heaterStatus(value) {
        let heaterSwitch = new Item(value);
        heaterSwitch.spy = jest.spyOn(heaterSwitch, 'sendCommand')
        this.addItem(HEATER_SWITCH, heaterSwitch);
        return this;
    }

    heaterAuto(value) {
        this.addItem(HEATER_AUTO, new Item(value));
        return this;
    }
}

export class Item {
    rawState;
    spy; // used for testing

    constructor(value) {
        this.rawState = value;
    }

    sendCommand(value) {
        this.rawState = value
    }
}

