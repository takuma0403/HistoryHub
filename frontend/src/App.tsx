import { useRoutes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import routes from "./route";

export default function App() {
  return (
    <>
      <AppHeader />
      {useRoutes(routes)}
    </>
  );
}
