export const formalityLevels: Record<number, string> = {
  1: "very casual",
  2: "casual",
  3: "formal yet engaging",
  4: "formal",
  5: "very formal",
};

export const initialMessage =
  "Hey! Welcome to ThankYouGPT. Any details you can share from the meeting?";

export const relationshipTypes = {
  NEVER_MET: "We never met",
  INTRODUCED: "Only intro'ed",
  BRIEFLY_MET: "We briefly met",
  ONE_ON_ONE: "Had a 1:1",
  INTERVIEW: "Had an interview",
} as const;

export const goalTypes = {
  THANKS: "Just say thanks",
  STAY_IN_TOUCH: "Offer to stay in touch",
  CONNECT: "Connect with another person",
  PHONE_CALL: "A phone call",
  MEETING: "A meeting",
} as const;

// Type helpers if needed
export type RelationshipType = typeof relationshipTypes[keyof typeof relationshipTypes];
export type GoalType = typeof goalTypes[keyof typeof goalTypes];
