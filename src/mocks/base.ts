import {
  HttpResponse,
  delay,
  type HttpResponseInit,
  type JsonBodyType,
} from "msw";
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

const delayDuration = 1000;
export const delayResponse = async <TBody extends JsonBodyType>(
  body?: TBody | null,
  init?: HttpResponseInit
) => {
  await delay(delayDuration);
  return HttpResponse.json<TBody>(body, init);
};
