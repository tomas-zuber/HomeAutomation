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
* - move constants into updateHeating function
* - call function `updateHeating(items)`
* */
export const POWER_SUM = "PowerSum";
export const POWER_MAX_CONSUMPTION = 0;

export const AIR_HEAT_STATUS = "Rekup_heat_status"; // ON/OFF
export const AIR_HEAT_AUTO = "Rekup_heat_auto"; // ON/OFF
export const AIR_HEAT_SWITCH = "Rekup_heat_switch"; // toggle
export const AIR_POWER_LIMIT = -500;

export const BOILER_AUTO = "Switch1_auto"; // ON/OFF
export const BOILER_SWITCH = "shellyplug__1921680202_Power"; // ON/OFF
export const BOILER_POWER_LIMIT = -600;

export const ON = "ON";
export const OFF = "OFF";

function switchAirHeat(items, status) {
    let airHeatSwitch = items.getItem(AIR_HEAT_SWITCH);
    airHeatSwitch.sendCommand(status);
    return AIR_POWER_LIMIT * (status === ON ? -1 : 1)
}
function switchBoiler(items, status) {
    let boilerSwitch = items.getItem(BOILER_SWITCH);
    boilerSwitch.sendCommand(status);
    return BOILER_POWER_LIMIT * (status === ON ? -1 : 1)
}

function handleAir(airHeatAuto, powerSum, airHeatStatus, items) {
    if (airHeatAuto === ON) {
        if (powerSum <= AIR_POWER_LIMIT && airHeatStatus === OFF) {
            powerSum += switchAirHeat(items, ON);
        } else if (powerSum > POWER_MAX_CONSUMPTION && airHeatStatus === ON) {
            powerSum += switchAirHeat(items, OFF);
        }
    } else {
        if (airHeatStatus === ON) {
            powerSum += switchAirHeat(items, OFF);
        }
    }
    return powerSum;
}

function handleBoiler(boilerAuto, powerSum, boilerStatus, items) {
    if (boilerAuto === ON) {
        if (powerSum <= BOILER_POWER_LIMIT && boilerStatus === OFF) {
            switchBoiler(items, ON);
        } else if (powerSum > POWER_MAX_CONSUMPTION && boilerStatus === ON) {
            switchBoiler(items, OFF);
        }
    } else {
        if (boilerStatus === ON) {
            switchBoiler(items, OFF);
        }
    }
}

export function updateHeating(items) {
    const airHeatStatus = items.getItem(AIR_HEAT_STATUS).rawState.toString();
    const airHeatAuto = items.getItem(AIR_HEAT_AUTO).rawState.toString();
    const boilerStatus = items.getItem(BOILER_SWITCH).rawState.toString();
    const boilerAuto = items.getItem(BOILER_AUTO).rawState.toString();
    let powerSum = items.getItem(POWER_SUM).rawState

    powerSum = handleAir(airHeatAuto, powerSum, airHeatStatus, items);
    handleBoiler(boilerAuto, powerSum, boilerStatus, items);
}
