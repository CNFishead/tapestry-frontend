"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Sheets.module.scss";
import { Button, Card, CardBody, CardHeader, TextField } from "@tapestry/ui";
import SheetCard from "@/components/sheetCard/SheetCard.component";

// MVP shape (replace with API type later)
type CharacterSheet = {
  id: string;
  name: string;
  archetype?: string;
  level?: number;
  updatedAt?: string;
  avatarUrl?: string | null;
};

// Temporary mock data to prove UI flow.
// Replace with react-query call once your endpoint exists.
const mockSheets: CharacterSheet[] = [
  {
    id: "char_1",
    name: "Darrick of Everpine",
    archetype: "Warden",
    level: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "char_2",
    name: "Sera Dawnsong",
    archetype: "Seeker",
    level: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "char_3",
    name: "Darrick of Everpine",
    archetype: "Warden",
    level: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "char_4",
    name: "Sera Dawnsong",
    archetype: "Seeker",
    level: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "char_5",
    name: "Darrick of Everpine",
    archetype: "Warden",
    level: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "char_6",
    name: "Sera Dawnsong",
    archetype: "Seeker",
    level: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

export default function SheetsView() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Later: replace mockSheets with data from API:
  // const { data: sheets = [], isLoading } = useSheetsQuery();
  const sheets = mockSheets;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sheets;
    return sheets.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, sheets]);

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Sheets</h1>
          <p className={styles.subTitle}>Your characters, ready to play.</p>
        </div>

        <div className={styles.actions}>
          <Button
            tone="gold"
            variant="solid"
            onClick={() => router.push("/characters/new")} // create this route next
          >
            New Character
          </Button>
        </div>
      </div>

      <div className={styles.searchRow}>
        <TextField
          id="sheetSearch"
          label="Search"
          placeholder="Search characters…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className={styles.emptyCard}>
          <CardHeader className={styles.emptyHeader}>
            <div className={styles.emptyTitle}>No characters found</div>
            <div className={styles.emptySub}>
              {sheets.length === 0 ? "Create your first character to get started." : "Try a different search."}
            </div>
          </CardHeader>

          <CardBody className={styles.emptyBody}>
            {sheets.length === 0 ? (
              <Button tone="gold" fullWidth onClick={() => router.push("/characters/new")}>
                Create Character
              </Button>
            ) : (
              <Button tone="purple" variant="outline" fullWidth onClick={() => setQuery("")}>
                Clear Search
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className={styles.grid}>
          {filtered.map((c) => (
            <SheetCard key={c.id} character={c} />
          ))}
        </div>
      )}
    </div>
  );
}
