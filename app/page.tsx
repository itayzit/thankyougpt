"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SendHorizontal, Mail } from "lucide-react";
import { initialMessage } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { relationshipTypes, goalTypes, RelationshipType, GoalType } from "./constants";

export default function ThankYouGPT() {
  const [lines, setLines] = useState(6);
  const [formality, setFormality] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relationship, setRelationship] = useState<RelationshipType>(relationshipTypes.BRIEFLY_MET);
  const [goal, setGoal] = useState<GoalType>(goalTypes.CONNECT);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousMessagesLength, setPreviousMessagesLength] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId] = useState(uuidv4());

  const suggestions = [
    "Jessica- Mckinsey, started in healthcare (like i did), likes equinox",
    "Chad- Finance, Trust fund, 6'5, blue eyes",
  ];

  const handleSendEmail = (content: string) => {
    const subject =
      content.match(/^Subject:\s*(.+)$/m)?.[1]?.trim() || "Thank You Email";
    const body = encodeURIComponent(
      content.replace(/^Subject:.*$/m, "").trim(),
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`,
      "_blank",
    );
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      lines,
      formality,
      relationship,
      goal,
      sessionId,
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: initialMessage,
      },
    ],
  });
  useEffect(() => {
    if (messages.length > previousMessagesLength) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setPreviousMessagesLength(messages.length);
  }, [previousMessagesLength, messages]);

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-6xl">
      <div className="text-left mb-4 sm:mb-6 pl-2 sm:pl-4 pt-2 sm:pt-4">
        <h1 className="text-2xl font-bold text-black mb-1">ThankYouGPT</h1>
        <p className="text-gray-600">
          Effortless thank-you emails for ivy league students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-3 sm:gap-4 bg-blue-50 rounded-lg p-3 sm:p-4">
        <div className="bg-white/80 rounded-lg flex flex-col h-[500px] sm:h-[600px]">
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              <label className="text-sm">How well do you know the person?</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(relationshipTypes).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRelationship(r)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      relationship === r
                        ? "text-xs sm:text-sm bg-custom_primary text-gray-600"
                        : "text-xs sm:text-sm bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <label className="text-sm">What would you like to achieve?</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(goalTypes).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      goal === g
                        ? "text-xs sm:text-sm bg-custom_primary text-gray-600"
                        : "text-xs sm:text-sm bg-gray-100 text-gray-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-gray-600"
              >
                Advanced
                <svg
                  className={`ml-2 h-4 w-4 transform ${showAdvanced ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Length</label>
                    <Slider
                      value={[lines]}
                      onValueChange={(value) => setLines(value[0])}
                      min={3}
                      max={9}
                      step={1}
                      marks={[
                        { value: 3, label: "Concise" },
                        { value: 6, label: "Detailed" },
                        { value: 9, label: "Lengthy" },
                      ]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Formality</label>
                    <Slider
                      value={[formality]}
                      onValueChange={(value) => setFormality(value[0])}
                      min={1}
                      max={5}
                      step={1}
                      marks={[
                        { value: 1, label: "Casual" },
                        { value: 5, label: "Formal" },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 flex flex-col h-[500px] sm:h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 sm:px-4 py-2 max-w-[75%] sm:max-w-[70%] ${
                    message.role === "user"
                      ? "bg-custom_primary text-primary-muted"
                      : "bg-muted"
                  }`}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  <div className="whitespace-pre-wrap break-words mb-1">
                    {message.content}
                  </div>
                  {message.role === "assistant" &&
                    message.content !== initialMessage && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleSendEmail(message.content)}
                      >
                        <Mail />
                      </Button>
                    )}
                  <div className="text-[10px] opacity-70 mb-1 text-right">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {showSuggestions && (
            <div className="flex flex-col gap-2 mb-1 mx-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  className="text-xs sm:text-sm bg-custom_primary text-gray-600 break-words w-fit"
                  style={{
                    whiteSpace: "normal",
                    height: "auto",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                  onClick={() => {
                    setInput(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              handleSubmit(e);
              setShowSuggestions(false);
            }}
            className="mt-3 sm:mt-4 flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Who did you speak with? What about?"
              className="flex-1 placeholder:text-s"
            />
            <Button type="submit" size="icon">
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-4 text-left pl-4">
        Developed by{" "}
        <a href="https://www.linkedin.com/in/itayzitvar/">Itay Zitvar</a> and{" "}
        <a href="https://www.linkedin.com/in/jonathan-schwartz8/">
          Jonathan Schwartz
        </a>
      </div>
    </div>
  );
}
