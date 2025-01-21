"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface Mark {
  value: number;
  label: string;
}

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  marks?: Mark[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, marks, ...props }, ref) => (
  <div className="relative w-full">
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
    {marks && (
      <div className="relative w-full mt-2">
        <div className="flex justify-between w-full">
          {marks.map((mark) => (
            <div
              key={mark.value}
              className="text-xs text-muted-foreground"
            >
              {mark.label}
            </div>
          ))}
        </div>
      </div>
    )}
    <div className="h-2" />
  </div>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
