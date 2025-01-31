
import React from "react";
import { Route, Routes } from "react-router-dom";

import "./index.scss";
import Notifications from "./components/Notifications";

const App = () => (
  <>
  <Routes>
   <Route path="/" element={<Notifications />}/> 
 </Routes>
 </>
);

export default App;