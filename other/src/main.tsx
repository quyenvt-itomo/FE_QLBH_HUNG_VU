import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./animista.css";
import { Provider } from "react-redux";
import store from "./stores/index.ts";
import "./i18n";

const loader = document.getElementById("initial-loader");
if (loader) {
  loader.classList.add("hide");

  setTimeout(() => {
    loader.remove();
  }, 900);
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
