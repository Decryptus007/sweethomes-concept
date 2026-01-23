"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  date,
  setDate,
  className,
  minDate,
  maxDate,
  placeholder = "Pick a date",
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-full justify-start border-0 bg-transparent px-1 text-left text-xs font-normal md:px-4 md:text-base",
            className,
          )}
        >
          {/* <CalendarIcon /> */}
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          disabled={(date) => {
            // Disable past dates
            if (minDate && date < minDate) {
              return true;
            }
            // Disable dates beyond max date
            if (maxDate && date > maxDate) {
              return true;
            }
            return false;
          }}
          fromDate={minDate}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}
