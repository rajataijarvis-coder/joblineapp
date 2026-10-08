import { openai } from "eve/models/openai";
import { defineAgent } from "eve";

export default defineAgent({
  model: openai("gpt-4o"),
  reasoning: "high",
});
