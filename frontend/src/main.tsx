import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F9FCFD",
    },
    text: {
      primary: "#082627",
    },
    primary: {
      main: "#28A6A5",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
