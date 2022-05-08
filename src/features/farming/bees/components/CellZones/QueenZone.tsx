import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import { QueenCell } from "./Queen/QueenCell";

const POPOVER_TIME_MS = 1000;

export const QueenZone: React.FC = () => {
  const { selectedItem } = useContext(Context);

  return (
    <div className="flex justify-center flex-col ">
      {/* Top row */}
      <div className="w3/5 flex justify-between ">
        <QueenCell selectedItem={selectedItem} cellIndex={0} />
      </div>
    </div>
  );
};
