import type { TabsItem } from "@tapestry/ui";
import { OverviewTab } from "./tabs/overview/OverviewTab";

type TabKey = "overview" | "skills" | "inventory" | "conditions" | "notes";

export type { TabKey };

export function createTabs(props: { sheet: any }): TabsItem[] {
  const { sheet } = props;

  return [
    {
      key: "overview",
      label: "Overview",
      icon: undefined,
      children: <OverviewTab sheet={sheet} />,
    },
    {
      key: "skills",
      label: "Skills",
      icon: undefined,
      children: <div>Skills placeholder</div>,
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: undefined,
      children: <div>Inventory placeholder</div>,
    },
    {
      key: "conditions",
      label: "Conditions",
      icon: undefined,
      children: <div>Conditions placeholder</div>,
    },
    {
      key: "notes",
      label: "Notes",
      icon: undefined,
      children: <div>Notes placeholder</div>,
    },
  ];
}
