import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import Decimal from "decimal.js-light";

import flowerSheet from "assets/resources/flower/Flower_harvest.png";
import flowerSheetWhite from "assets/resources/flower/Flower_harvest_white.png";
import honeySheet from "assets/resources/flower/Honey_sheet_Updated.png";
import flowerStump from "assets/resources/flower/flower_stump.png";
import bee from "assets/animals/bees/bee.png";
import pollen from "assets/resources/flower/pollen.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import {
  canPollinate,
  POLLINATE_ERRORS,
  getRequiredBeeAmount,
  COOLDOWN_LIST,
  getGivenPollen,
} from "features/game/events/bees/harvestPollen";

import { getTimeLeft } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { pollinateAudio, honeyHarvestAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Reward } from "features/game/types/game";

import { FlowerReward } from "./FlowerReward";

const POPOVER_TIME_MS = 1000;
const HITS = 3;

interface Props {
  flowerIndex: number;
}

export const Flower: React.FC<Props> = ({ flowerIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [showLabel, setShowLabel] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();
  const [reward, setReward] = useState<Reward | null>();
  const [touchCount, setTouchCount] = useState(0);
  // When to hide the honey jar that pops out
  const [collecting, setCollecting] = useState(false);

  const flowerRef = useRef<HTMLDivElement>(null);
  const shakeGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const [showStumpTimeLeft, setShowStumpTimeLeft] = useState(false);

  // Reset the shake count when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (flowerRef.current && !flowerRef.current.contains(event.target)) {
        setTouchCount(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const flower = game.context.state.flowers[flowerIndex];

  // Users will need to refresh to chop the tree again
  const harvested = !canPollinate(flower);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  // Show/Hide Time left on hover

  const handleMouseHoverStump = () => {
    setShowStumpTimeLeft(true);
  };

  const handleMouseLeaveStump = () => {
    setShowStumpTimeLeft(false);
  };

  const onCollectReward = () => {
    setReward(null);
    setTouchCount(0);

    gameService.send("flower.pollinated", {
      index: flowerIndex,
    });
  };
  const beesNeeded = getRequiredBeeAmount(
    game.context.state.inventory,
    flower.name
  );
  const beeAmount = game.context.state.inventory.Bee || new Decimal(0);

  // Has enough axes to chop the tree
  const hasBees =
    (selectedItem === "Bee" || beesNeeded.eq(0)) && beeAmount.gte(beesNeeded);

  const shake = async () => {
    if (game.matches("readonly")) {
      shakeGif.current?.goToAndPlay(0);
      return;
    }

    if (!hasBees) {
      return;
    }

    const isPlaying = shakeGif.current?.getInfo("isPlaying");

    if (isPlaying) {
      return;
    }

    pollinateAudio.play();
    shakeGif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // On third shake, pollinate
    if (touchCount > 0 && touchCount === HITS - 1) {
      pollinate();
      honeyHarvestAudio.play();
      setTouchCount(0);
    }
  };

  const pollinate = async () => {
    setTouchCount(0);

    // Already looking at a reward
    if (reward) {
      return;
    }

    if (
      flower?.reward &&
      getTimeLeft(flower.pollinatedAt, COOLDOWN_LIST[flower.name]) == 0
    ) {
      if (touchCount < 1) {
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      setReward(flower.reward);

      return;
    }

    try {
      gameService.send("flower.pollinated", {
        index: flowerIndex,
        name: flower.name,
        item: selectedItem,
      });
      setCollecting(true);
      choppedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={pollen} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${getGivenPollen(
            flower.name
          )}`}</span>
        </div>
      );

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      if (e.message === POLLINATE_ERRORS.NO_BEES) {
        displayPopover(
          <div className="flex">
            <img src={bee} className="w-4 h-4 mr-2" />
            <span className="text-xs text-white text-shadow">No bees left</span>
          </div>
        );
        return;
      }

      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const handleHover = () => {
    if (game.matches("readonly") || hasBees) return;
    flowerRef.current?.classList["add"]("cursor-not-allowed");
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    if (game.matches("readonly") || hasBees) return;
    flowerRef.current?.classList["remove"]("cursor-not-allowed");
    setShowLabel(false);
  };

  const timeLeft = getTimeLeft(flower.pollinatedAt, COOLDOWN_LIST[flower.name]);
  const percentage = 100 - (timeLeft / COOLDOWN_LIST[flower.name]) * 100;

  const message = `${flower.name} recovery in: `;

  return (
    <div className="relative" style={{ height: "106px" }}>
      {!harvested && (
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          ref={flowerRef}
          className="group cursor-pointer  w-full h-full"
          onClick={shake}
        >
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none transform"
            style={{
              width: `${GRID_WIDTH_PX * 4}px`,
              // Line it up with the click area
              transform: `translateX(-${GRID_WIDTH_PX * 2.5}px) `,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              shakeGif.current = spritesheet;
            }}
            image={
              flower.name == "White Flower" ? flowerSheetWhite : flowerSheet
            }
            widthFrame={266}
            heightFrame={168}
            fps={24}
            steps={11}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
            }}
          />
          <div
            className={`absolute bottom-8 -right-[1rem] transition pointer-events-none w-28 z-20 ${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            <Label>Equip a bee first</Label>
          </div>
          <div className={`${flower ? "opacity-0" : "opacity-100"}`}>
            <Label>{flower.name}</Label>
          </div>
        </div>
      )}

      <Spritesheet
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          // Line it up with the click area
          transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          imageRendering: "pixelated",
        }}
        className="absolute bottom-0 pointer-events-none"
        getInstance={(spritesheet) => {
          choppedGif.current = spritesheet;
        }}
        image={honeySheet}
        widthFrame={266}
        heightFrame={168}
        fps={24}
        steps={8}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {harvested && (
        <>
          <img
            src={flowerStump}
            className="absolute"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              bottom: "9px",
              left: "5px",
              transform: "scale(2)",
            }}
            onMouseEnter={handleMouseHoverStump}
            onMouseLeave={handleMouseLeaveStump}
          />
          <div className="absolute -bottom-4 left-1.5">
            <ProgressBar percentage={percentage} seconds={timeLeft} />
          </div>
          <TimeLeftPanel
            text={message}
            timeLeft={timeLeft}
            showTimeLeft={showStumpTimeLeft}
          />
        </>
      )}

      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute top-4 left-2",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={collecting ? 0 : 100 - (touchCount / 3) * 100} />
      </div>

      <div
        className={classNames(
          "transition-opacity absolute -bottom-5 w-40 -left-16 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
      <FlowerReward
        reward={reward}
        onCollected={onCollectReward}
        flowerIndex={flowerIndex}
      />
    </div>
  );
};
