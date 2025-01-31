import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./index.scss";
import "./App.css";

const RemoteAnalyticsApp = React.lazy(() => import("analytics/Analytics"));
const RemoteAdoptionsApp = React.lazy(() => import("adoption/Adoption"));
const RemoteNotificationsApp = React.lazy(() =>
  import("notifications/Notifications")
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="container-app">
        <nav className="navbar">
          <ul className="nav-list">
            <li>
              <Link to="/adoption" className="nav-link">
                Adoption
              </Link>
            </li>
            <li>
              <Link to="/notifications" className="nav-link">
                Notifications
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="nav-link">
                Analytics
              </Link>
            </li>
          </ul>
        </nav>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/analytics/*" element={<RemoteAnalyticsApp />} />
            <Route path="/adoption/*" element={<RemoteAdoptionsApp />} />
            <Route path="/notifications/*" element={<RemoteNotificationsApp />} />
            <Route path="/" element={<div>Welcome to the Container App</div>} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
