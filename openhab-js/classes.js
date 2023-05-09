import {POWER_SUM} from "./heating_rules";

export class ItemMap {
    values = new Map();

    addItem(name, value) {
        this.values.set(name, value);
    }

    getItem(name) {
        return this.values.get(name);
    }

    power(value) {
        this.addItem(POWER_SUM, new Item(value))
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

