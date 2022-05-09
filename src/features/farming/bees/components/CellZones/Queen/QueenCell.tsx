import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import cancel from "assets/icons/cancel.png";
import eatIcon from "assets/icons/eatIcon.jpg";
import bee from "assets/animals/bees/bee.png";
import drone from "assets/animals/bees/drone.png";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";

import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { InterQueenCell } from "./InterQueenCell";
import { beesAudio } from "lib/utils/sfx";

import { BeeItem } from "features/game/types/craftables";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  cellIndex: number;
  className?: string;
  onboarding?: boolean;
}

export const isNewBeeReady = (
  now: number,
  workerAt: number,
  workSeconds: number
) => now - workerAt > workSeconds * 1000;

export const QueenCell: React.FC<Props> = ({
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

  const { setToast } = useContext(ToastContext);

  const cell = game.context.state.queenChamber[cellIndex];

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const handleMouseHover = () => {
    console.log("handleMouseHover cell doesnt exist");
    // check field if there is a queen
    if (cell) {
      const queen = cell.worker;

      console.log("handleMouseHover cell exist");
      // show details if queen is deposited
      if (queen) {
        setShowWorkerDetails(true);
      }
    }

    return;
  };

  const handleMouseLeave = () => {
    setShowWorkerDetails(false);
  };

  const retireQueen = () => {
    gameService.send("queen.retired", {
      index: cellIndex,
    });
    console.log("queen retired");
  };

  const feedQueen = () => {
    gameService.send("queen.feeded", {
      index: cellIndex,
    });

    setToast({ content: "HONEY -5" });
  };

  const produceWorkers = () => {
    gameService.send("workerBee.producing", {
      index: cellIndex,
    });

    setToast({ content: "Queen Working..." });
  };

  const produceDrones = () => {
    gameService.send("droneBee.producing", {
      index: cellIndex,
    });

    setToast({ content: "Queen Working..." });
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
        gameService.send("queen.deposited", {
          index: cellIndex,
          item: selectedItem,
        });

        beesAudio.play();

        displayPopover(
          <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            <img
              src={ITEM_DETAILS[selectedItem as BeeItem].image}
              className="w-4 mr-1"
            />
            <span>Queen deposited</span>
          </div>
        );
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(<img className="w-5" src={cancel} />);
      }
      setTouchCount(0);

      return;
    }

    if (cell.active) {
      try {
        gameService.send("harvest.bees", {
          index: cellIndex,
          item: selectedItem,
        });
        setToast({ content: ` +12 Bees` });
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(<img className="w-5" src={cancel} />);
      }
      if (cell.reward == "Drone") {
        try {
          gameService.send("harvest.drones", {
            index: cellIndex,
            item: selectedItem,
          });
          setToast({ content: `+3 Drones` });
        } catch (e: any) {
          // TODO - catch more elaborate errors
          displayPopover(<img className="w-5" src={cancel} />);
        }
        setTouchCount(0);
        return;
      }

      setTouchCount(0);

      return;
    }
  };

  const playing = game.matches("playing") || game.matches("autosaving");

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
      }}
    >
      <InterQueenCell className="relative   -bottom-2" cell={cell} />

      <div className="flex absolute -bottom-14">
        <Button className="w-8 m-1" onClick={() => retireQueen()}>
          <img src={cancel} alt="" />
        </Button>
        <Button className="w-8 m-1" onClick={() => feedQueen()}>
          <img src={eatIcon} alt="" />
        </Button>
      </div>

      <div className="flex absolute -bottom-28">
        <Button className="w-8 m-1" onClick={() => produceWorkers()}>
          <img src={bee} alt="" />
        </Button>

        <Button className="w-8 m-1" onClick={() => produceDrones()}>
          <img src={drone} alt="" />
        </Button>
      </div>

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
