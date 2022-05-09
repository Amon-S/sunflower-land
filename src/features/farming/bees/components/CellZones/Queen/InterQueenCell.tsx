import React, { useEffect, useRef, useState } from "react";

import hiveCell from "assets/icons/hiveCell.png";
import queen from "assets/animals/bees/queen2.gif";
import bees from "assets/animals/bees//beeGif.gif";
import drone from "assets/animals/bees/droneGif.gif";
import { getTimeLeft } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";

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

export const InterQueenCell: React.FC<Props> = ({ cell, className }) => {
  const [_, setTimer] = React.useState<number>(0);
  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  const [showWorkerDetail, setShowWorkerDetails] = useState(false);

  React.useEffect(() => {
    if (cell) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
  }, [cell, setHarvestTime]);

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

  if (!cell) {
    return <img src={hiveCell} className={classnames("w-full", className)} />;
  }

  if (cell.worker == "Queen" && !cell.active) {
    return (
      <>
        <EnergyBar energyAmount={cell.energy} />
        <img src={queen} className={classnames("w-full ", className)} />{" "}
      </>
    );
  }
  const bee = BEE_ITEMS[cell.worker];
  const time = BEE_ITEMS["Queen"].workTime as number;
  const lifecycle = CELL_LIFECYCLE["Queen"];
  const timeLeft = getTimeLeft(cell.taskStart as number, time);
  const percentage = 100 - (timeLeft / time) * 100;
  const isAlmostReady = percentage >= 50;

  if (cell.active && timeLeft > 0) {
    return (
      <>
        <EnergyBar energyAmount={cell.energy} />
        <div className="absolute left-28 bottom-54">
          <span>{cell.reward}</span>
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
        <img
          onMouseEnter={handleMouseHover}
          onMouseLeave={handleMouseLeave}
          src={isAlmostReady ? lifecycle.almost : lifecycle.initial}
          className={classnames("w-full bottom-4 ", className)}
        />
      </>
    );
  }

  return (
    <Ready
      className={className as string}
      image={cell.reward == "Bee" ? bees : drone}
    />
  );
};
