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

export const AIR_HEAT_STATUS = "Rekup_heat_status"; // ON/OFF
export const AIR_HEAT_AUTO = "Rekup_heat_auto"; // ON/OFF
export const AIR_HEAT_SWITCH = "Rekup_heat_switch"; // toggle
export const AIR_POWER_LIMIT = -500;

export const HEATER_AUTO = "Switch1_auto"; // ON/OFF
export const HEATER_SWITCH = "shellyplug__1921680202_Power"; // ON/OFF
export const HEATER_POWER_LIMIT = -600;

export const BOILER_AUTO = "Switch2_auto"; // ON/OFF
export const BOILER_SWITCH = "shellyplugs2__1921680204_Power"; // ON/OFF
export const BOILER_POWER_LIMIT = -800;
export const BOILER_DAILY_USAGE = "Plug2_daily_powerOn"; // minutes
export const BOILER_DAILY_USAGE_MAX = 180; // minutes

export const ON = "ON";
export const OFF = "OFF";

function switchAirHeat(items, status) {
    let airHeatSwitch = items.getItem(AIR_HEAT_SWITCH);
    airHeatSwitch.sendCommand(status);
    return AIR_POWER_LIMIT * (status === ON ? -1 : 1)
}

function switchHeater(items, status) {
    let heaterSwitch = items.getItem(HEATER_SWITCH);
    heaterSwitch.sendCommand(status);
    return HEATER_POWER_LIMIT * (status === ON ? -1 : 1)
}

function switchBoiler(items, status) {
    let boilerSwitch = items.getItem(BOILER_SWITCH);
    boilerSwitch.sendCommand(status);
    return BOILER_POWER_LIMIT * (status === ON ? -1 : 1)
}

function updateAir(items, power) {
    const airHeatStatus = items.getItem(AIR_HEAT_STATUS).rawState.toString();
    const airHeatAuto = items.getItem(AIR_HEAT_AUTO).rawState.toString();
    console.log("air %s %s %s", airHeatStatus, airHeatAuto, power)
    if (airHeatAuto === ON) {
        if (power <= AIR_POWER_LIMIT && airHeatStatus === OFF) {
            return switchAirHeat(items, ON);
        } else if (power > POWER_MAX_CONSUMPTION && airHeatStatus === ON) {
            return switchAirHeat(items, OFF);
        }
    } else {
        if (airHeatStatus === ON) {
            return switchAirHeat(items, OFF);
        }
    }
    return 0;
}

function updateHeater(items, power) {
    const heaterStatus = items.getItem(HEATER_SWITCH).rawState.toString();
    const heaterAuto = items.getItem(HEATER_AUTO).rawState.toString();
    console.log("heater %s %s %s", heaterStatus, heaterAuto, power)
    if (heaterAuto === ON) {
        if (power <= HEATER_POWER_LIMIT && heaterStatus === OFF) {
            return switchHeater(items, ON);
        } else if (power > POWER_MAX_CONSUMPTION && heaterStatus === ON) {
            return switchHeater(items, OFF);
        }
    } else {
        if (heaterStatus === ON) {
            return switchHeater(items, OFF);
        }
    }
    return 0;
}

function updateBoiler(items, power) {
    const boilerStatus = items.getItem(BOILER_SWITCH).rawState.toString();
    const boilerAuto = items.getItem(BOILER_AUTO).rawState.toString();
    console.log("boiler %s %s %s", boilerStatus, boilerAuto, power)
    if (boilerAuto === ON) {
        if (items.getItem(BOILER_DAILY_USAGE).rawState >= BOILER_DAILY_USAGE_MAX) {
            if (boilerStatus === ON) {
                return switchBoiler(items, OFF);
            }
            return 0
        }
        if (power <= BOILER_POWER_LIMIT && boilerStatus === OFF) {
            return switchBoiler(items, ON);
        } else if (power > POWER_MAX_CONSUMPTION && boilerStatus === ON) {
            return switchBoiler(items, OFF);
        }
    } else {
        if (boilerStatus === ON) {
            return switchBoiler(items, OFF);
        }
    }
    return 0;
}

export function updateHeating(items) {
    let powerSum = items.getItem(POWER_SUM).rawState
    if (powerSum > POWER_MAX_CONSUMPTION) { // reverse order of turning off
        powerSum += updateBoiler(items, powerSum);
        powerSum += updateHeater(items, powerSum);
        updateAir(items, powerSum);
    } else {
        powerSum += updateAir(items, powerSum);
        powerSum += updateHeater(items, powerSum);
        updateBoiler(items, powerSum);
    }
}
