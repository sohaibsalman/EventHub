import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "../../features/home/HomePage";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

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
