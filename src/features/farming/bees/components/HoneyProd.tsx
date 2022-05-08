import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { useContext, useState } from "react";
import { CellZoneOne } from "./CellZones/CellZoneOne";
import { CellZoneTwo } from "./CellZones/CellZoneTwo";
import queen from "assets/animals/bees/queenGif.gif";
import drone from "assets/animals/bees/droneGif.gif";
import { Modal } from "react-bootstrap";
import { OuterPanel, Panel } from "components/ui/Panel";
import close from "assets/icons/close.png";
import beeBox from "assets/buildings/beeHive.png";
import { QueenZone } from "./CellZones/QueenZone";
import { CellZoneThree } from "./CellZones/CellZoneThree";

export const HoneyProd: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const isUnlocked = state.inventory["Bee Box"];
  return (
    <div className="flex flex-row ">
      <div className=" flex w-3/5 flex-col">
        <div className=" flex  flex-wrap h-fit mt-3 ">
          <CellZoneOne />
        </div>
        <div className="flex   ">
          {/* Top row */}

          <div className=" flex flex-wrap h-fit mt-3 ">
            <CellZoneTwo />
          </div>
          {!isUnlocked ? (
            <img
              src={drone}
              className="flex relative "
              onClick={() => setShowModal(true)}
              style={{
                width: `${GRID_WIDTH_PX * 0.75}px`,
                height: `${GRID_WIDTH_PX * 0.75}px`,
                right: `${GRID_WIDTH_PX * -0.1}px`,
                top: `${GRID_WIDTH_PX * 1.55}px`,
              }}
            />
          ) : (
            <img
              src={queen}
              className=" flex relative"
              style={{
                width: `${GRID_WIDTH_PX * 0.75}px`,
                height: `${GRID_WIDTH_PX * 0.75}px`,
                right: `${GRID_WIDTH_PX * -0.1}px`,
                top: `${GRID_WIDTH_PX * 1.75}px`,
              }}
            />
          )}
        </div>
        <div className=" flex flex-wrap mt-3 ">
          <CellZoneThree />
        </div>
      </div>
      <OuterPanel className="flex-1 w-2/5">
        <QueenZone />
      </OuterPanel>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          <div className="flex items-start">
            <img src={drone} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">
                Drones are still creating these cells
              </span>
              <img
                src={beeBox}
                className="w-8 img-highlight float-right mr-1"
              />
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
