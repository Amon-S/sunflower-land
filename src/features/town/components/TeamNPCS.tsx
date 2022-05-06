import { Npc } from "features/musicStage/components/Npc";
import React from "react";

import devtest from "assets/npcs/stage/devtest.gif";
import chicken from "assets/npcs/stage/Chicken_Admin_NSFW.gif";
import spencer from "assets/npcs/stage/Dev_Spencer.gif";
import adam from "assets/npcs/stage/Dev_Blue_Shirt.gif";
import brown from "assets/npcs/stage/Dev_Brown_Shirt.gif";

const NPC_LIST = [
  {
    message: `"I tried to think of something clever, but ended up farming instead" Theroulette`,
  },
  {
    message: `"Team Goblin? Team sunflower? What about Team Chicken?" Chicken`,
  },
  {
    message: `"Games should be owned by the community that supports them" Adam`,
  },
  {
    message: `"Be Respectful, Stay Positive and Have Fun!" Steve`,
  },
  {
    message: `"Life is about planting seeds and watching them grow" Spencer`,
  },
];

export const TeamNPCS: React.FC = () => {
  return (
    <div>
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
