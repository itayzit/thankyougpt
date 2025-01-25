export const formalityLevels: Record<number, string> = {
  1: "very casual",
  2: "casual",
  3: "formal yet engaging",
  4: "formal",
  5: "very formal",
} as const;

export const initialMessage =
  "Hey! Welcome to ThankYouGPT. Any details you can share about the person?";

export const relationshipTypes: Record<string, string> = {
  NEVER_MET: "We never met",
  INTRODUCED: "Only intro'ed",
  BRIEFLY_MET: "We briefly met",
  ONE_ON_ONE: "We had a 1:1",
  INTERVIEW: "We had an interview",
} as const;

export const goalTypes: Record<string, string> = {
  THANKS: "Just say thanks",
  STAY_IN_TOUCH: "Offer to stay in touch",
  CONNECT: "Connect with another person",
  PHONE_CALL: "A phone call",
  MEETING: "A meeting",
} as const;

// Type helpers if needed
export type RelationshipType = typeof relationshipTypes[keyof typeof relationshipTypes];
export type GoalType = typeof goalTypes[keyof typeof goalTypes];
