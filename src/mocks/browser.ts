import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

export const startWorker = () =>
  worker.start({
    // onUnhandledRequest: ({ method, url }) => {
    //   if (url.startsWith("/api")) {
    //     throw new Error(`Unhandled ${method} request to ${url}`);
    //   }
    // },
  });
