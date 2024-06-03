/*
PowerSum (Type=NumberItem, State=-1569.0, Label=Power Sum, Category=)
Rekup_heat_status (Type=StringItem, State=1, Label=Rekup_heat_status, Category=, Tags=[Point])
Rekup_power (Type=StringItem, State=535 W    , Label=Rekup_power, Category=, Tags=[Point])
Rekup_heat_auto (Type=SwitchItem, State=ON, Label=Rekup_heat_auto, Category=)
Rekup_heat_switch (Type=SwitchItem, State=ON, Label=Rekup_heat_switch, Category=, Tags=[Point])

shellyplug__1921680202_Power_Consumption (Type=NumberItem, State=0 W, Label=Switch1 Power, Category=Energy, Tags=[Measurement, Power])
shellyplug__1921680202_Power (Type=SwitchItem, State=OFF, Label=Switch1, Category=Switch, Tags=[Switch, Power])
Switch1_auto (Type=StringItem, State=OFF, Label=Switch1_auto, Category=)
*/
/*
* When moving to openhab:
* - remove `export` keyword
* - move all code into a wrapping function doUpdate{ ... code ... updateHeating(items);}
* - call function `doUpdate(items);`
* */
export const POWER_SUM = "PowerSum";
export const POWER_MAX_CONSUMPTION = 0;
export const POWER_BUFFER_PER_ITEM = 0;
export const AUTO_ORDERING = "AutoOrdering";

class Heating {
    constructor(name, switchItem, statusItem, autoItem, consumption, dailyItem = null, dailyLimit = null) {
        this.name = name
        this.switchItem = switchItem
        this.statusItem = statusItem // ON/OFF
        this.autoItem = autoItem // ON/OFF
        this.consumption = consumption // watt
        this.dailyItem = dailyItem
        this.dailyLimit = dailyLimit // minutes
    }

    change(items, status) {
        let heatSwitch = items.getItem(this.switchItem);
        heatSwitch.sendCommand(status);
        return this.consumption * (status === ON ? -1 : 1)
    }

    update(items, power) {
        const status = items.getItem(this.statusItem).rawState.toString();
        const autoStatus = items.getItem(this.autoItem).rawState.toString();
        console.log("%s status:%s; auto:%s; power:%s", this.name, status, autoStatus, power)
        if (autoStatus === ON) {
            if (this.dailyItem != null && items.getItem(this.dailyItem).rawState >= this.dailyLimit) {
                if (status === ON) {
                    return this.change(items, OFF);
                }
                return 0
            }

            if (power <= this.consumption && status === OFF) {
                return this.change(items, ON);
            } else if (power > POWER_MAX_CONSUMPTION && status === ON) {
                return this.change(items, OFF);
            }
        } else {
            if (status === ON) {
                return this.change(items, OFF);
            }
        }
        return 0;
    }
}

export const ventilation = new Heating(
    "ventilation",
    "Rekup_heat_switch",
    "Rekup_heat_status",
    "Rekup_heat_auto",
    -500)

export const radiator = new Heating(
    "radiator",
    "shellyplug__1921680202_Power",
    "shellyplug__1921680202_Power",
    "Switch1_auto",
    -600)

export const boiler = new Heating(
    "boiler",
    "shellyplugs2__1921680204_Power",
    "shellyplugs2__1921680204_Power",
    "Switch2_auto",
    -800,
    "Plug2_daily_powerOn",
    180)

export const ON = "ON";
export const OFF = "OFF";

export function updateHeating(items) {
    let ordering = items.getItem(AUTO_ORDERING).rawState.toString().trim().split(" ");
    let turnedOnSize = ordering.length
    let powerSum = items.getItem(POWER_SUM).rawState + (turnedOnSize * POWER_BUFFER_PER_ITEM) // TODO

    if (powerSum > POWER_MAX_CONSUMPTION) { // reverse order of turning off
        powerSum += boiler.update(items, powerSum);
        powerSum += radiator.update(items, powerSum);
        ventilation.update(items, powerSum);
    } else {
        powerSum += ventilation.update(items, powerSum);
        powerSum += radiator.update(items, powerSum);
        boiler.update(items, powerSum);
    }
}
