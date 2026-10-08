import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel, defaultSlackAuth, defineSlackRenderer } from "eve/channels/slack";

export default slackChannel({
  // The connector uid lives in SLACK_CONNECTOR (set it on the project, or leave
  // it unset). The fallback matches the connector you named with `vercel connect
  // create slack --name spoke-and-mirror`, so this works out of the box.
  credentials: connectSlackCredentials(
    process.env.SLACK_CONNECTOR ?? "slack/joblineapp",
  ),

  // Answer @mentions from a real user; ignore bot chatter. defaultSlackAuth
  // stamps Slack identity, but does not invent a shop membership tier.
  onAppMention: (ctx, message) =>
    message.author ? { auth: defaultSlackAuth(message, ctx) } : null,

  // Event handlers are not top-level config — they live on a renderer.
  // Each handler receives (eventData, channel, ctx, next); call next() to
  // hand off to the rest of the chain (eve's default renderer posts the reply).
  renderers: [
    defineSlackRenderer({
      events: {
        // Post the final reply to the thread, skipping interim tool-call narration.
        "message.completed"(eventData, channel, ctx, next) {
          if (eventData.finishReason === "tool-calls") return;
          return next();
        },
      },
    }),
  ],
});
