import React, { useEffect, useRef } from "react";

import classNames from "classnames";

import hiveCell from "assets/icons/hiveCell.png";
import queen from "assets/animals/bees/queen2.gif";
import { getTimeLeft, secondsToMidString } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";

import { QueenChamber } from "features/game/types/game";

import { addNoise, RandomID } from "lib/images";

import classnames from "classnames";
import { CELL_LIFECYCLE } from "features/farming/bees/lib/cellPlant";
import { BEE_ITEMS } from "features/game/types/craftables";
import { EnergyBar } from "components/ui/EnergyBar";

interface Props {
  cell?: QueenChamber;
  className?: string;
  showbeeDetails?: boolean;
}

const Ready: React.FC<{ image: string; className: string }> = ({
  image,
  className,
}) => {
  const id = useRef(RandomID());

  useEffect(() => {
    // Randomly add some noise to the bees
    if (Math.random() > 0.8) {
      addNoise(id.current, 0.15);
    }
  }, []);

  return (
    <img
      id={id.current}
      src={image}
      className={classnames("w-full", className)}
    />
  );
};

export const InterQueenCell: React.FC<Props> = ({
  cell,
  className,
  showbeeDetails,
}) => {
  const [_, setTimer] = React.useState<number>(0);
  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  React.useEffect(() => {
    if (cell) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
  }, [cell, setHarvestTime]);

  if (!cell) {
    return <img src={hiveCell} className={classnames("w-full", className)} />;
  }

  if (cell.worker == "Queen") {
    return (
      <>
        <EnergyBar energyAmount={cell.energy} />{" "}
        <img src={queen} className={classnames("w-full ", className)} />{" "}
      </>
    );
  }

  const bee = BEE_ITEMS[cell.worker];
  const time = bee.workTime as number;
  const lifecycle = CELL_LIFECYCLE["Queen"];
  const timeLeft = getTimeLeft(cell.taskStart as number, time);

  // Seedling
  if (timeLeft > 0) {
    const percentage = 100 - (timeLeft / time) * 100;
    const isAlmostReady = percentage >= 50;

    return (
      <div className="relative w-full h-full">
        <img
          src={isAlmostReady ? lifecycle.almost : lifecycle.initial}
          className={classnames("w-full", className)}
        />

        <div className="absolute w-full -bottom-4 z-10">
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
        <InnerPanel
          className={classNames(
            "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-1 z-20 pointer-events-none",
            {
              "opacity-100": showbeeDetails,
              "opacity-0": !showbeeDetails,
            }
          )}
        >
          <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
            <div className="flex flex-1 items-center justify-center">
              <img src={lifecycle.ready} className="w-4 mr-1" />
              <span>{cell.worker}</span>
            </div>
            <span className="flex-1">{secondsToMidString(timeLeft)}</span>
          </div>
        </InnerPanel>
      </div>
    );
  }

  return <Ready className={className as string} image={lifecycle.ready} />;
};
