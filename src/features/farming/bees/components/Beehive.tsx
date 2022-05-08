import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";

import bee from "assets/buildings/hive.png";
import { beesAudio } from "lib/utils/sfx";
import beehive from "assets/buildings/beehive.gif";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { BeeSale } from "./BeeInterface";
import classNames from "classnames";
import { Section } from "lib/utils/hooks/useScrollIntoView";
export const Beehive: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  //function to open the modal and play hive sound
  const openHive = () => {
    setIsOpen(true);
    beesAudio.play();
  };

  return (
    <div
      id={Section["Bee Hive"]}
      className={classNames("absolute", {
        "cursor-pointer": isNotReadOnly,
        "hover:img-highlight": isNotReadOnly,
      })}
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 5}px`,
        top: `${GRID_WIDTH_PX * 5}px`,
      }}
    >
      <img
        src={beehive}
        alt="beehive"
        onClick={isNotReadOnly ? openHive : undefined}
        className="w-full top-10"
        style={{ transform: "scale(0.9)" }}
      />
      {isNotReadOnly && (
        <Action
          className="relative -top-10 left-4"
          text="Hive"
          icon={bee}
          onClick={openHive}
        />
      )}
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <BeeSale onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
