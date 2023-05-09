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

export const AIR_HEAT_STATUS = "Rekup_heat_status";
export const AIR_HEAT_AUTO = "Rekup_heat_auto";
export const AIR_POWER = "Rekup_power";
export const AIR_HEAT_SWITCH = "Rekup_heat_switch";
export const AIR_POWER_LIMIT = -450;

export const PLUG1_POWER = "shellyplug__1921680202_Power_Consumption";
export const PLUG1_SWITCH = "shellyplug__1921680202_Power";
export const PLUG1_AUTO = "Switch1_auto";

export const ON = "ON";
export const OFF = "OFF";

export function updateHeating(items) {
    let powerSum = items.getItem(POWER_SUM).rawState
    let airHeatSwitch = items.getItem(AIR_HEAT_SWITCH);
    if (powerSum < AIR_POWER_LIMIT && airHeatSwitch.rawState === OFF) {
        airHeatSwitch.sendCommand(ON)
    }
    // TODO implement
}
