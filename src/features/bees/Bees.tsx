import React, { useContext } from "react";
import { Beehive } from "./components/Beehive";
 
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const Bees: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
 
  return (
    // Container
    <div
      style={{
        height: `${GRID_WIDTH_PX * 5}px`,
        width: `${GRID_WIDTH_PX * 6}px`,
        left: `calc(50% -  ${GRID_WIDTH_PX * -13.5}px)`,
        top: `calc(50% -  ${GRID_WIDTH_PX * 40}px)`,
      }}
      className="absolute z-10"
    >
      <div className="h-full w-full relative  left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Beehive />
       </div>
    </div>
  );
};
