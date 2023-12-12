import {
    radiator,
    boiler,
    ventilation,
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
        this.addItem(ventilation.switchItem, airHeatSwitch);

        this.airStatus(OFF);
        this.airAuto(OFF);
        this.heaterStatus(OFF)
        this.heaterAuto(OFF)
        this.boilerStatus(OFF)
        this.boilerAuto(OFF)
        this.boilerDailyUsage(0)
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
        this.addItem(ventilation.statusItem, new Item(value));
        return this;
    }

    airAuto(value) {
        this.addItem(ventilation.autoItem, new Item(value));
        return this;
    }

    heaterStatus(value) {
        let heaterSwitch = new Item(value);
        heaterSwitch.spy = jest.spyOn(heaterSwitch, 'sendCommand')
        this.addItem(radiator.switchItem, heaterSwitch);
        return this;
    }

    heaterAuto(value) {
        this.addItem(radiator.autoItem, new Item(value));
        return this;
    }

    boilerStatus(value) {
        let boilerSwitch = new Item(value);
        boilerSwitch.spy = jest.spyOn(boilerSwitch, 'sendCommand')
        this.addItem(boiler.switchItem, boilerSwitch);
        return this;
    }

    boilerAuto(value) {
        this.addItem(boiler.autoItem, new Item(value));
        return this;
    }

    boilerDailyUsage(value) {
        this.addItem(boiler.dailyItem, new Item(value));
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

