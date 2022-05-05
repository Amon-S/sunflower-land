import React, { useState } from "react";

 

 
import { CellZoneOne } from "./CellZones/CellZoneOne";
 

export const HoneyProd: React.FC = () => {
 

  return (
    <div className="flex ">
      <div className="w-3/5 flex flex-wrap h-fit  ">
        <CellZoneOne />
      </div>
    </div>
  );
};
