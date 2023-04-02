import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
