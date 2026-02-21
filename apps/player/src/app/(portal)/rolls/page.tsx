import { roll3d6 } from "@tapestry/rules";

export default function RollsPage() {
  const r = roll3d6(2);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Rolls</h1>
      <div className="rounded border p-3 text-sm">
        Rolled: [{r.dice.join(", ")}] = {r.sum} + {r.modifier} → <b>{r.total}</b>
      </div>
    </div>
  );
}
