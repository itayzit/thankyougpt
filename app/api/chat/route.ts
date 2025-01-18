import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { eventTypeToPrompt, formalityLevels } from "@/app/constants";
import { insertMessage } from "@/lib/db";

const systemPromptTemplate =
  "This GPT acts as MBA student at a top business school, writing thank-you emails after meeting professionals at {eventType}. Its role is to draft professional and intriguing thank-you emails based on notes provided from networking conversations.\n" +
  "The GPT should tailor each response to reflect the unique points of the conversation, express gratitude, and reinforce interest in the company or industry. It will always keep a {formality} tone, reflecting both ambition and genuine appreciation. If there's anything in common between the sender and the receiver, mention it.\n" +
  'All thank-you emails should be short - only {lines} lines. Only If relevant, this GPT should ask a question like "What do you think I can do at school to be better at X". It should mention the person\'s name in the beginning of the email (as in "My name is [Your Name]"). This GPT is short and concise, and sounds natural for a native English speaker.';

export async function POST(req: Request) {
  const { messages, lines, formality, eventType, sessionId } = await req.json();
  const systemPrompt = systemPromptTemplate
    .replace("{lines}", lines.toString())
    .replace("{eventType}", eventTypeToPrompt[eventType])
    .replace("{formality}", formalityLevels[formality]);
  const environment =
    process.env.NODE_ENV === "production" ? "production" : "staging";

  await insertMessage("system", systemPrompt, sessionId, environment);
  await insertMessage(
    "user",
    messages[messages.length - 1].content,
    sessionId,
    environment,
  );

  const result = streamText({
    model: openai("gpt-4"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    onFinish: async (completion) => {
      await insertMessage("assistant", completion.text, sessionId, environment);
    },
  });
  return result.toDataStreamResponse();
}
