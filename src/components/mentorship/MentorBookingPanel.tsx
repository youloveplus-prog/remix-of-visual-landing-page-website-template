import { useEffect, useMemo, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Clock, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DetailSection } from "@/components/ui/detail-section";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Mentor } from "@/hooks/useMentors";

const DAYS_AHEAD = 7;
const BASE_SLOTS = ["09:00", "11:00", "14:00", "16:30", "18:00", "20:00"];
const SLOT_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function slotsForDay(date: Date, mentorId: string): string[] {
  const seed = (date.getDate() + mentorId.charCodeAt(0)) % BASE_SLOTS.length;
  return BASE_SLOTS.filter((_, i) => (i + seed) % 3 !== 0);
}

const today0 = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const bookingSchema = z.object({
  date: z
    .string()
    .regex(DATE_RE, { message: "Please pick a valid date" })
    .refine(
      (v) => {
        const d = new Date(`${v}T00:00:00`);
        const max = addDays(today0(), DAYS_AHEAD - 1);
        return d >= today0() && d <= max;
      },
      { message: "Date must be within the next 7 days" },
    ),
  slot: z
    .string()
    .regex(SLOT_RE, { message: "Please choose a time slot" }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Notes must be under 500 characters" })
    .optional()
    .or(z.literal("")),
});

type BookingValues = z.infer<typeof bookingSchema>;

interface Props {
  mentor: Mentor;
}

export function MentorBookingPanel({ mentor }: Props) {
  const today = useMemo(today0, []);
  const days = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)),
    [today],
  );

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      date: format(days[0], "yyyy-MM-dd"),
      slot: "",
      notes: "",
    },
  });

  const dateValue = form.watch("date");
  const slotValue = form.watch("slot");
  const selectedDay = useMemo(() => new Date(`${dateValue}T00:00:00`), [dateValue]);
  const slots = useMemo(
    () => slotsForDay(selectedDay, mentor.id),
    [selectedDay, mentor.id],
  );

  // Clear slot if it disappears after switching day
  useEffect(() => {
    if (slotValue && !slots.includes(slotValue)) {
      form.setValue("slot", "", { shouldValidate: false });
    }
  }, [slots, slotValue, form]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingValues | null>(null);

  const onContinue = form.handleSubmit(() => setConfirmOpen(true));

  const handleConfirm = () => {
    const values = form.getValues();
    setConfirmed(values);
    toast({
      title: "Session request sent",
      description: `${mentor.name} will confirm your ${format(selectedDay, "EEE d MMM")} · ${values.slot} session shortly.`,
    });
  };

  const handleClose = (open: boolean) => {
    setConfirmOpen(open);
    if (!open && confirmed) {
      setConfirmed(null);
      form.reset({
        date: format(days[0], "yyyy-MM-dd"),
        slot: "",
        notes: "",
      });
    }
  };

  return (
    <DetailSection title="Book a session">
      <p className="text-[13px] text-muted-foreground -mt-1">
        Pick a day and time. We'll hold the slot for 15 minutes while you confirm.
      </p>

      <Form {...form}>
        <form onSubmit={onContinue} className="space-y-5" noValidate>
          {/* Day strip */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[12px] font-normal text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Next 7 days
                </FormLabel>
                <FormControl>
                  <div
                    role="radiogroup"
                    aria-label="Booking date"
                    className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x"
                  >
                    {days.map((d) => {
                      const value = format(d, "yyyy-MM-dd");
                      const active = isSameDay(d, selectedDay);
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            field.onChange(value);
                            form.setValue("slot", "", { shouldValidate: false });
                          }}
                          className={cn(
                            "snap-start min-w-[64px] rounded-2xl border px-3 py-2 text-center transition",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/40",
                          )}
                        >
                          <div className="text-[10.5px] uppercase tracking-wide opacity-80">
                            {format(d, "EEE")}
                          </div>
                          <div className="text-[16px] font-semibold tabular-nums leading-tight">
                            {format(d, "d")}
                          </div>
                          <div className="text-[10px] opacity-80">{format(d, "MMM")}</div>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slots */}
          <FormField
            control={form.control}
            name="slot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[12px] font-normal text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Available times · {format(selectedDay, "EEE d MMM")}
                </FormLabel>
                <FormControl>
                  {slots.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground">
                      No times available — try another day.
                    </p>
                  ) : (
                    <div
                      role="radiogroup"
                      aria-label="Time slot"
                      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                    >
                      {slots.map((s) => {
                        const active = s === field.value;
                        return (
                          <button
                            key={s}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => field.onChange(s)}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-[13px] font-medium tabular-nums transition",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/40",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-normal text-muted-foreground">
                  Notes for the mentor (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    maxLength={500}
                    placeholder="Goals, current level, anything they should know…"
                    className="resize-none"
                  />
                </FormControl>
                <div className="flex justify-between gap-2">
                  <FormMessage />
                  <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                    {(field.value ?? "").length}/500
                  </span>
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Free to reserve · no payment yet</span>
            </div>
            <Button type="submit" size="sm" disabled={!form.formState.isValid}>
              Continue
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={confirmOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {!confirmed ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm your session</DialogTitle>
                <DialogDescription>
                  Review the details below. You can reschedule any time before the session starts.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border bg-muted/30 p-4 space-y-3 text-[13.5px]">
                <Row label="Mentor" value={mentor.name} />
                <Row
                  label="Subject"
                  value={mentor.subjects[0] ?? "General mentorship"}
                />
                <Row label="Date" value={format(selectedDay, "EEEE, d MMM yyyy")} />
                <Row label="Time" value={`${slotValue} · 45 min`} />
                <Row label="Format" value="Online 1-on-1" />
                {form.getValues("notes")?.trim() && (
                  <div className="border-t pt-3">
                    <div className="text-muted-foreground mb-1">Notes</div>
                    <p className="text-foreground whitespace-pre-wrap break-words">
                      {form.getValues("notes")}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-muted-foreground">Price</span>
                  <Badge variant="secondary" className="font-normal">
                    Pay after first session
                  </Badge>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Back
                </Button>
                <Button onClick={handleConfirm}>Confirm booking</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">Session requested</DialogTitle>
                <DialogDescription className="text-center">
                  {mentor.name} will confirm your{" "}
                  <span className="text-foreground font-medium">
                    {format(new Date(`${confirmed.date}T00:00:00`), "EEE d MMM")} · {confirmed.slot}
                  </span>{" "}
                  session shortly. You'll get a notification when it's accepted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button className="w-full" onClick={() => handleClose(false)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DetailSection>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  );
}
