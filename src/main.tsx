import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./animista.css";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "@/shared/stores/index.ts";

const queryClient = new QueryClient();

const loader = document.getElementById("initial-loader");
if (loader) {
  loader.classList.add("hide");

  setTimeout(() => {
    loader.remove();
  }, 2000);
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>,
);
