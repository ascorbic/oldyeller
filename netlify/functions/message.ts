import { Handler } from "@netlify/functions";

import { App, AwsLambdaReceiver } from "@slack/bolt";

const receiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
});

app.command("/message", async ({ ack }) => {
  await ack("I'm working!");
});

export const handler = receiver.toHandler() as unknown as Handler;
