"use client";

import { useState } from "react";
import AccountDrawer from "@/components/accountDrawer/AccountDrawer.component";
import styles from "./PortalHeader.module.scss";

export default function PortalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.title}>Tapestry Portal</div>

          <button className={styles.menuBtn} onClick={() => setOpen(true)} aria-label="Open menu">
            ☰
          </button>
        </div>
      </header>

      <AccountDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
