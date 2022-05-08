import React from "react";

import energyEmpty from "assets/ui/progress/energy_empty.png";
import energyOne from "assets/ui/progress/energy_1.png";
import energyTwo from "assets/ui/progress/energy_2.png";
import energyThree from "assets/ui/progress/energy_3.png";
import energyFour from "assets/ui/progress/energy_4.png";
import energyFull from "assets/ui/progress/energy_full.png";
interface Props {
  energyAmount: number;
}

export const EnergyBar: React.FC<Props> = ({ energyAmount }) => {
  if (energyAmount >= 5) {
    return <img src={energyFull} className="w-10" />;
  }

  if (energyAmount >= 4) {
    return <img src={energyFour} className="w-10" />;
  }

  if (energyAmount >= 3) {
    return <img src={energyThree} className="w-10" />;
  }

  if (energyAmount >= 2) {
    return <img src={energyTwo} className="w-10" />;
  }

  if (energyAmount >= 1) {
    return <img src={energyOne} className="w-10" />;
  }
  return <img src={energyEmpty} className="w-10" />;
};
