import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import { Cell } from "./Cell";

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
