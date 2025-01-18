"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
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
import { SendHorizontal } from "lucide-react";
import { eventTypeToPrompt, formalityLevels } from "./constants";

export default function ThankYouGPT() {
  const [lines, setLines] = React.useState(6);
  const [formality, setFormality] = React.useState(3);
  const [eventType, setEventType] = React.useState("Coffee chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousMessagesLength, setPreviousMessagesLength] = React.useState(0);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      lines,
      formality,
      eventType,
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hey! Welcome to ThankYouGPT. Any details you can share from the meeting?",
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
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-left mb-6 pl-4 pt-4">
        <h1 className="text-2xl font-bold text-black mb-1"> ThankYouGPT</h1>
        <p className="text-gray-600">
          Craft engaging thank-you emails in seconds
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4 bg-blue-50 rounded-lg p-4">
        <div className="bg-white/80 p-6 rounded-lg space-y-6">
          <h2 className="text-lg font-semibold">Settings</h2>

          <div className="space-y-2">
            <label className="text-sm">How many lines?</label>
            <Slider
              value={[lines]}
              onValueChange={(value) => setLines(value[0])}
              min={3}
              max={9}
              step={1}
            />
            <div className="text-xs text-muted-foreground text-right">
              <span className="bg-secondary text-black px-2 py-1 rounded">
                {lines} lines
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
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Casual</span>
              <span>Formal</span>
            </div>
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

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
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
