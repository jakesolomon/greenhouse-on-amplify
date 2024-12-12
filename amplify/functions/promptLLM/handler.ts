import OpenAI from "openai";
import { env } from '$amplify/env/promptLLM';

import { Schema } from "../../data/resource";

export const handler: Schema["promptLLM"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { prompt } = event.arguments
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt! }
    ],
  });

  return completion.choices[0].message.content;
};