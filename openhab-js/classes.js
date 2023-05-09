export class ItemMap {
    values = new Map();

    addItem(name, value) {
        this.values.set(name, value);
    }

    getItem(name) {
        return this.values.get(name);
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

