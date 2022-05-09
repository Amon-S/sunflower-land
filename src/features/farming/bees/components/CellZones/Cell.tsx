import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import cancel from "assets/icons/cancel.png";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";

import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { InterCell } from "./InterCell";
import { beesAudio, honeyHarvestAudio } from "lib/utils/sfx";

import { BEES, HiveBee } from "features/game/types/craftables";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  cellIndex: number;
  className?: string;
  onboarding?: boolean;
}

export const isHoneyReady = (
  now: number,
  workerAt: number,
  harvestSeconds: number
) => now - workerAt > harvestSeconds * 1000;

export const Cell: React.FC<Props> = ({
  selectedItem,
  className,
  cellIndex,
}) => {
  const [popover, setPopover] = useState<JSX.Element | null>();
  const { gameService } = useContext(Context);
  const [touchCount, setTouchCount] = useState(0);
  const [showWorkerDetail, setShowWorkerDetails] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [game] = useActor(gameService);
  const clickedAt = useRef<number>(0);
  const cell = game.context.state.hiveCells[cellIndex];

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const handleMouseHover = () => {
    // check field if there is a crop
    if (cell) {
      const bee = cell.worker;
      const time = BEES[bee].workTime;
      const now = Date.now();
      const isReady = isHoneyReady(now, cell.taskStart, time as number);
      const isJustWorked = now - (time as number) < 1000;

      // show details if cell is NOT ready and NOT just planted
      if (!isReady && !isJustWorked) {
        setShowWorkerDetails(true);
      }
    }

    return;
  };

  const handleMouseLeave = () => {
    setShowWorkerDetails(false);
  };

  const onClick = () => {
    // Small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // Plant
    if (!cell) {
      try {
        gameService.send("drone.working", {
          index: cellIndex,
          item: selectedItem,
        });

        beesAudio.play();

        displayPopover(
          <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            <img
              src={ITEM_DETAILS[selectedItem as HiveBee].image}
              className="w-4 mr-1"
            />
            <span>-1</span>
          </div>
        );
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(<img className="w-5" src={cancel} />);
      }

      return;
    }

    try {
      gameService.send("honey.harvested", {
        index: cellIndex,
        item: selectedItem,
      });
      honeyHarvestAudio.play();

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
          <img src={ITEM_DETAILS["Honey"].image} className="w-4 mr-1" />
          <span>{`+${cell.multiplier || 1}`}</span>
        </div>
      );
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover(<img className="w-5" src={cancel} />);
    }

    setTouchCount(0);
  };

  const playing = game.matches("playing") || game.matches("autosaving");

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX * 1.8}px`,
        height: `${GRID_WIDTH_PX * 1.8}px`,
      }}
    >
      <InterCell
        className="absolute bottom-0"
        cell={cell}
        showbeeDetails={showWorkerDetail}
      />
      <div
        className={classNames(
          "transition-opacity absolute -bottom-2 w-full z-20 pointer-events-none flex justify-center",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
      {playing && (
        <img
          src={selectBox}
          style={{
            opacity: 0.1,
          }}
          className="absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer"
          onClick={onClick}
        />
      )}
    </div>
  );
};
