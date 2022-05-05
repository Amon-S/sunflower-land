import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { Cell } from "./Cell";


export const CellZoneTwo: React.FC = () => {
 
  const { selectedItem } = useContext(Context);

  return (
    <div className="flex justify-center flex-col ">
      {/* Top row */}
      <div className="w3/5 flex justify-between ">
        <Cell selectedItem={selectedItem} cellIndex={3} />
        <Cell selectedItem={selectedItem} cellIndex={4} />
        <Cell selectedItem={selectedItem} cellIndex={5} />
      </div>
    </div>
  );
};
