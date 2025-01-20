"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SendHorizontal, Mail } from "lucide-react";
import { eventTypeToPrompt, initialMessage } from "./constants";
import { v4 as uuidv4 } from "uuid";

export default function ThankYouGPT() {
  const [lines, setLines] = React.useState(6);
  const [formality, setFormality] = React.useState(3);
  const [eventType, setEventType] = React.useState(
    Object.keys(eventTypeToPrompt)[0],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousMessagesLength, setPreviousMessagesLength] = React.useState(0);
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

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "/api/chat",
      body: {
        lines,
        formality,
        eventType,
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

  const lineDescriptions = {
    3: 'Concise',
    4: 'Brief',
    5: 'Moderate',
    6: 'Detailed',
    7: 'Very Detailed',
    8: 'Extensive',
    9: 'Lengthy'
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-left mb-6 pl-4 pt-4">
        <h1 className="text-2xl font-bold text-black mb-1"> ThankYouGPT</h1>
        <p className="text-gray-600">
          Effortless thank-you emails for ivy league students.
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4 bg-blue-50 rounded-lg p-4">
        <div className="bg-white/80 p-6 rounded-lg space-y-6">
          <h2 className="text-lg font-semibold">Settings</h2>

          <div className="space-y-4">
            <label className="text-sm">Length</label>
            <div className="pt-2">
              <Slider
                value={[lines]}
                onValueChange={(value) => setLines(value[0])}
                min={3}
                max={9}
                step={1}
                marks={[
                  { value: 3, label: 'Concise' },
                  { value: 6, label: 'Detailed' },
                  { value: 9, label: 'Lengthy' }
                ]}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right mt-6">
              <span className="bg-secondary text-black px-2 py-1 rounded">
                {lineDescriptions[lines as keyof typeof lineDescriptions]}
              </span>
            </div>
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
                { value: 1, label: 'Casual' },
                { value: 5, label: 'Formal' }
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Event type</label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(eventTypeToPrompt).map((eventType) => (
                  <SelectItem key={eventType} value={eventType}>
                    {eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-custom_primary text-primary-muted"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap mb-1">
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
            <div ref={messagesEndRef} />
          </div>
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 rounded mb-1 ml-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  className="text-sm bg-custom_primary text-gray-600"
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
            className="mt-4 flex gap-2"
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
    </div>
  );
}
