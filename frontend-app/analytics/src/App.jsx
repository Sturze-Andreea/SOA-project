
import React from "react";
import { Route, Routes } from "react-router-dom";

import "./index.scss";
import Analytics from "./components/Analytics";

const App = () => (
  <>
  <Routes>
   <Route path="/" element={<Analytics />}/> 
 </Routes>
 </>
);

export default App;