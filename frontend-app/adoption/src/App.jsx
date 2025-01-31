
import React from "react";
import { Route, Routes } from "react-router-dom";

import "./index.scss";
import Adoption from "./components/Adoption";

const App = () => (
  <>
  <Routes>
   <Route path="/" element={<Adoption />}/> 
 </Routes>
 </>
);

export default App;