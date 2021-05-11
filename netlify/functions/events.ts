import { Handler, HandlerEvent } from "@netlify/functions";

import { App, AwsLambdaReceiver } from "@slack/bolt";
import { AwsEvent } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { LogLevel } from "@slack/logger";
import normalizeHeaderCase from "header-case-normalizer";

const receiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  logLevel: LogLevel.DEBUG,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

const messages = [
  "I CAN'T HEAR YOU!!!",
  "WHERE IS YOUR CAPS LOCK???!!",
  "YOU'RE IN THE WRONG ROOM!!",
  "SPEAK UP!!",
];

app.message(/[a-z]/, async ({ message, say }) => {
  await say({
    text: messages[Math.floor(Math.random() * messages.length)],
    thread_ts: message.ts,
  });
});

const apphandler = receiver.toHandler();

const normalizeHeaders = (headers: HandlerEvent["headers"]) =>
  Object.keys(headers).reduce((prev, next) => {
    return { ...prev, [normalizeHeaderCase(next)]: headers[next] };
  }, headers);

export const handler: Handler = (event, ...rest) => {
  const newEvent = {
    ...event,
    headers: normalizeHeaders(event.headers),
  } as unknown as AwsEvent;

  return apphandler(newEvent, ...rest);
};
