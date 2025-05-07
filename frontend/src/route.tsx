import { RouteObject } from "react-router-dom";
import ReduxSample from "./pages/ReduxSample";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Portofolio from "./pages/Portfolio";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <ReduxSample />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path:"/:username",
    element: <Portofolio />
  },
  {
    path: "/error/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Navigate to="/error/404" replace />,
  },
];

export default routes;
