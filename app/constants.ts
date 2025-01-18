export const eventTypeToPrompt: Record<string, string> = {
  "Coffee chat": "a coffee chat",
  EIS: "an employer information session",
  "Job interview": "a job interview",
  Other: "recruiting events",
};
export const formalityLevels: Record<number, string> = {
  1: "very casual",
  2: "casual",
  3: "formal yet engaging",
  4: "formal",
  5: "very formal",
};

export const initialMessage =
  "Hey! Welcome to ThankYouGPT. Any details you can share from the meeting?";
