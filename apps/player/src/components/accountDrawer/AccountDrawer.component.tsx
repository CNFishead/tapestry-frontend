"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe, useLogout } from "@/lib/auth-hooks";
import styles from "./AccountDrawer.module.scss";
import { Button } from "@tapestry/ui";


type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const { data: me } = useMe();
  const logout = useLogout();

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside className={styles.drawer} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.heading}>Account</div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.profile}>
          <div className={styles.name}>{me?.fullName ?? "Adventurer"}</div>
          <div className={styles.email}>{me?.email ?? ""}</div>
        </div>

        <nav className={styles.nav}>
          <Link className={styles.link} href="/settings" onClick={onClose}>
            Settings
          </Link>
        </nav>

        <div className={styles.footer}>
          <Button
            className={styles.logoutBtn}
            onClick={() => {
              logout();
              onClose();
              router.replace("/login");
            }}
          >
            Log out
          </Button>
        </div>
      </aside>
    </div>
  );
}