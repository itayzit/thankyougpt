import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { formalityLevels } from "@/app/constants";
import { insertMessage } from "@/lib/db";

const relationshipDescriptions = {
  "We never met": "reflect a cold outreach tone, acknowledge the absence of prior interaction, and politely introduce the sender while expressing enthusiasm for a future connection",
  "Only intro'ed": "reference the person who made the introduction if avaliable and express a desire to learn more",
  "We briefly met": "reference the brief interaction and express a desire to learn more",
  "We had a 1:1": "build on the discussion and suggest actionable next steps",
  "We had an interview": "express appreciation for the opportunity, reiterate enthusiasm for the role, and emphasize key takeaways from the discussion",
}

const goalDescriptions = {
  "Just say thanks": "focus on expressing gratitude without asking for anything",
  "Offer to stay in touch": "propose ways to maintain the connection",
  "Connect with another person": "express interest in a relevant introduction",
  "A phone call": "include a clear request to schedule a phone call",
  "A meeting": "include a clear request to schedule a meeting",
}

const systemPromptTemplate =
  "This GPT acts as MBA student at a top business school, writing thank-you emails after meeting professionals. Its role is to draft professional and intriguing thank-you emails based on notes provided from networking conversations.\n" +
  "The GPT should tailor each response to reflect the unique points of the conversation, express gratitude, and reinforce interest in the company or industry. It will always keep a {formality} tone, reflecting both ambition and genuine appreciation. If there's anything in common between the sender and the receiver, mention it.\n" +
  "The email content should carefully adjust based on the relationship the sender has with the receiver.\n" + 
  "The sender has the following relationship with the receiver: {relationship}, therefore the email should {relationshipDescription}.\n" +
  "Additionally, the email should align with the intended goal, which is {goal}, therefore the email should {goalDescription}.\n" +
  'All thank-you emails should be short - only {lines} lines. Only If relevant, this GPT should ask a question like "What do you think I can do at school to be better at X". It should mention the person\'s name in the beginning of the email (as in "My name is [Your Name]"). This GPT is short and concise, and sounds natural for a native English speaker. Don\'t ask for more details, work with what you have. No matter how little information you have about the person, write the thank you note anyway.';

export async function POST(req: Request) {
  const { messages, lines, formality, relationship, goal, sessionId } = await req.json();
  const systemPrompt = systemPromptTemplate
    .replace("{lines}", lines.toString())
    .replace("{goal}", goal)
    .replace("{goalDescription}", goalDescriptions[goal as keyof typeof goalDescriptions])
    .replace("{relationship}", relationship)
    .replace("{relationshipDescription}", relationshipDescriptions[relationship as keyof typeof relationshipDescriptions])
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
    model: openai("gpt-4o"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    onFinish: async (completion) => {
      await insertMessage("assistant", completion.text, sessionId, environment);
    },
  });
  return result.toDataStreamResponse();
}
