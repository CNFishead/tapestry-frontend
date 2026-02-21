"use client";

import PortalHeader from "@/components/portalHeader/PortalHeader.component";
import BottomNav from "@/components/bottomNav/BottomNav.component";
import styles from "./PortalShell.module.scss";

export default function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <PortalHeader />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </div>
  );
}