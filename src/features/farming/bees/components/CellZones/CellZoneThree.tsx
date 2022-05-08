import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { Cell } from "./Cell";

export const CellZoneThree: React.FC = () => {
  const { selectedItem } = useContext(Context);

  return (
    <div className="flex justify-center flex-col ">
      <div className="border-black flex justify-between ">
        <Cell selectedItem={selectedItem} cellIndex={4} />
        <Cell selectedItem={selectedItem} cellIndex={5} />
      </div>
    </div>
  );
};
