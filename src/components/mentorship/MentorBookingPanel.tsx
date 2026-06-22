import { useMemo, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { CalendarDays, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { Mentor } from "@/hooks/useMentors";

const DAYS_AHEAD = 7;
const BASE_SLOTS = ["09:00", "11:00", "14:00", "16:30", "18:00", "20:00"];

function slotsForDay(date: Date, mentorId: string): string[] {
  // Deterministic pseudo-availability so the UI feels alive without backend state.
  const seed = (date.getDate() + mentorId.charCodeAt(0)) % BASE_SLOTS.length;
  return BASE_SLOTS.filter((_, i) => (i + seed) % 3 !== 0);
}

interface Props {
  mentor: Mentor;
}

export function MentorBookingPanel({ mentor }: Props) {
  const today = useMemo(() => new Date(), []);
  const days = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)),
    [today],
  );

  const [selectedDay, setSelectedDay] = useState<Date>(days[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const slots = slotsForDay(selectedDay, mentor.id);

  const handleConfirm = () => {
    setConfirmed(true);
    toast({
      title: "Session request sent",
      description: `${mentor.name} will confirm your ${format(selectedDay, "EEE d MMM")} · ${selectedSlot} session shortly.`,
    });
  };

  const handleClose = (open: boolean) => {
    setConfirmOpen(open);
    if (!open && confirmed) {
      setConfirmed(false);
      setSelectedSlot(null);
    }
  };

  return (
    <DetailSection
      title="Book a session"
      description="Pick a day and time. We'll hold the slot for 15 minutes while you confirm."
    >
      <div className="space-y-5">
        {/* Day strip */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[12px] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Next 7 days</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {days.map((d) => {
              const active = isSameDay(d, selectedDay);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDay(d);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "snap-start min-w-[64px] rounded-2xl border px-3 py-2 text-center transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                  aria-pressed={active}
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
        </div>

        {/* Slots */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[12px] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Available times · {format(selectedDay, "EEE d MMM")}</span>
          </div>
          {slots.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No times available — try another day.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const active = s === selectedSlot;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSlot(s)}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-[13px] font-medium tabular-nums transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                    aria-pressed={active}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Free to reserve · no payment yet</span>
          </div>
          <Button
            size="sm"
            disabled={!selectedSlot}
            onClick={() => setConfirmOpen(true)}
          >
            Continue
          </Button>
        </div>
      </div>

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
                <Row label="Time" value={`${selectedSlot} · 45 min`} />
                <Row label="Format" value="Online 1-on-1" />
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
                    {format(selectedDay, "EEE d MMM")} · {selectedSlot}
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
