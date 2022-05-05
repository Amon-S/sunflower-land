import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Cell, isHoneyReady } from "./Cell";
import classNames from "classnames";
import { HealthBar } from "components/ui/HealthBar";
import { useActor } from "@xstate/react";
import { BEES } from "features/game/types/craftables";
 
const POPOVER_TIME_MS = 1000;

export const CellZoneOne: React.FC = () => {
  const { selectedItem } = useContext(Context);

  return (
    <div className="flex justify-center flex-col ">
      {/* Top row */}
      <div className="w3/5 flex justify-between ">
        <Cell selectedItem={selectedItem} cellIndex={0} />
        <Cell selectedItem={selectedItem} cellIndex={1} />
        <Cell selectedItem={selectedItem} cellIndex={2} />
      </div>
      
    </div>
  );
};
