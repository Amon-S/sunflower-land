import React from "react";

import { Routes, Route, HashRouter } from "react-router-dom";
import { Goblins } from "./Goblins";

import { Humans } from "./Humans";

export const Session: React.FC = () => {
  // Switch between humans and goblins using react router

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Humans />} />
        <Route path="/humans" element={<Humans />} />
        <Route path="/goblins" element={<Goblins />} />
      </Routes>
    </HashRouter>
  );
};
