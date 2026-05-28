import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface ServiceDetails {
  item_id: string;
  mode: "bookable" | "deliverable";
  delivery_days: number;
  session_minutes: number;
  max_revisions: number;
  included: string[];
}

export function ServiceDetailsForm({ itemId }: { itemId: string }) {
  const [s, setS] = useState<ServiceDetails | null>(null);
  const [includedText, setIncludedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("service_details")
        .select("*")
        .eq("item_id", itemId)
        .maybeSingle();
      if (data) {
        const inc = Array.isArray(data.included) ? (data.included as string[]) : [];
        setS({
          item_id: data.item_id,
          mode: data.mode,
          delivery_days: data.delivery_days,
          session_minutes: data.session_minutes,
          max_revisions: data.max_revisions,
          included: inc,
        });
        setIncludedText(inc.join("\n"));
      } else {
        setS({
          item_id: itemId,
          mode: "deliverable",
          delivery_days: 7,
          session_minutes: 60,
          max_revisions: 2,
          included: [],
        });
        setIncludedText("");
      }
      setLoading(false);
    })();
  }, [itemId]);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    const included = includedText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const { error } = await supabase.from("service_details").upsert(
      { ...s, included },
      { onConflict: "item_id" }
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Service details saved");
  };

  if (loading || !s) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Service mode</Label>
        <Select value={s.mode} onValueChange={(v: any) => setS({ ...s, mode: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deliverable">Deliverable (one-off package)</SelectItem>
            <SelectItem value="bookable">Bookable (live session)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {s.mode === "deliverable" ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Delivery (days)</Label>
            <Input
              type="number"
              value={s.delivery_days}
              onChange={(e) => setS({ ...s, delivery_days: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Max revisions</Label>
            <Input
              type="number"
              value={s.max_revisions}
              onChange={(e) => setS({ ...s, max_revisions: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label>Session length (min)</Label>
          <Input
            type="number"
            value={s.session_minutes}
            onChange={(e) => setS({ ...s, session_minutes: Number(e.target.value) || 0 })}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label>What's included (one per line)</Label>
        <Textarea
          rows={5}
          value={includedText}
          onChange={(e) => setIncludedText(e.target.value)}
          placeholder={"e.g.\n3 logo concepts\nSource files\n2 revisions"}
        />
      </div>

      <Button onClick={save} variant="premium" disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-1.5" /> {saving ? "Saving…" : "Save service details"}
      </Button>
    </div>
  );
}
