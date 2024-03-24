import "@/index.css";
import "@/tailwind.css";
import { store } from "@/lib/stores/base";
import { Router } from "@/routes/index";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container!);

async function setupMocking() {
  const { startWorker } = await import("@/mocks/base");
  return startWorker();
}

setupMocking().then(() => {
  root.render(
    <StrictMode>
      <ConfigProvider>
        <Provider store={store}>
          <Router />
          <ToastContainer />
        </Provider>
      </ConfigProvider>
    </StrictMode>
  );
});
