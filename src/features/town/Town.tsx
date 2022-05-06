import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Bank } from "features/bank/Bank";
import { Bakery } from "features/bakery/Bakery";
import { Blacksmith } from "features/blacksmith/Blacksmith";
import { Market } from "features/crops/components/Market";
import { WishingWell } from "features/wishingWell/WishingWell";
import { Mail } from "features/mail/Mail";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Npc } from "features/musicStage/components/Npc";

import devtest from "assets/npcs/stage/devtest.gif";
import chicken from "assets/npcs/stage/Chicken_Admin_NSFW.gif";
import spencer from "assets/npcs/stage/Dev_Spencer.gif";
import adam from "assets/npcs/stage/Dev_Blue_Shirt.gif";
import brown from "assets/npcs/stage/Dev_Brown_Shirt.gif";

const NPC_LIST = [
  {
    message:
      "I tried to think of something clever, but ended up farming instead",
  },
  {
    message: "I am Ken, Chic-Chic-Ken",
  },
  {
    message: "Games should to be owned by the community that supports them",
  },
  {
    message: "Be Respectful, Stay Positive and Have Fun!",
  },
  {
    message: "Life is about planting seeds and watching them grow",
  },
];

export const Town: React.FC = () => {
  return (
    <div
      id={Section.Town}
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 25}px`,
        height: `${GRID_WIDTH_PX * 9}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -15.8}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 18}px)`,
      }}
    >
      <Market />
      <Bank />
      <Bakery />
      <Blacksmith />
      <WishingWell />
      <Mail />

      <Npc
        img={devtest}
        message={NPC_LIST[0].message}
        X={-30}
        Y={4}
        scale={"scale(0.8)"}
      />
      <Npc
        img={chicken}
        message={NPC_LIST[1].message}
        X={-5}
        Y={9.5}
        scale={"scale(0.85)"}
      />
      <Npc
        img={adam}
        message={NPC_LIST[2].message}
        X={-43}
        Y={4}
        scale={"scale(0.8)"}
      />
      <Npc
        img={brown}
        message={NPC_LIST[3].message}
        X={-35}
        Y={-13}
        scale={"scale(0.7)"}
      />
      <Npc
        img={spencer}
        message={NPC_LIST[4].message}
        X={-20}
        Y={18}
        scale={"scale(0.7)"}
      />
    </div>
  );
};
