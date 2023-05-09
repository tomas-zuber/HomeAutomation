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
export const POWER_SUM = "PowerSum";

export const AIR_HEAT_STATUS = "Rekup_heat_status"; // ON/OFF
export const AIR_HEAT_AUTO = "Rekup_heat_auto"; // ON/OFF
export const AIR_HEAT_SWITCH = "Rekup_heat_switch"; // toggle
export const AIR_POWER_LIMIT = -450;

export const PLUG1_SWITCH = "shellyplug__1921680202_Power"; // ON/OFF
export const PLUG1_AUTO = "Switch1_auto"; // ON/OFF

export const ON = "ON";
export const OFF = "OFF";

export function updateHeating(items) {
    let powerSum = items.getItem(POWER_SUM).rawState
    let airHeatStatus = items.getItem(AIR_HEAT_STATUS).rawState;
    // let airHeatAuto = items.getItem(AIR_HEAT_AUTO).rawState;
    let airHeatSwitch = items.getItem(AIR_HEAT_SWITCH);

    // if (airHeatAuto === ON) ...
    if (powerSum <= AIR_POWER_LIMIT && airHeatStatus === OFF) {
        airHeatSwitch.sendCommand(ON)
    } else if (powerSum > AIR_POWER_LIMIT && airHeatStatus === ON) {
        airHeatSwitch.sendCommand(OFF)
    }
}
