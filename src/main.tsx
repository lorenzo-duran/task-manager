import "@/index.css";
import { store } from "@/lib/stores/base";
import { Router } from "@/routes/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container!);
export const queryClient = new QueryClient();

async function setupMocking() {
  const { startWorker } = await import("@/mocks/browser");
  return startWorker();
}

setupMocking().then(() => {
  root.render(
    <StrictMode>
      <ConfigProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router />
            <ToastContainer />
          </QueryClientProvider>
        </Provider>
      </ConfigProvider>
    </StrictMode>
  );
});
