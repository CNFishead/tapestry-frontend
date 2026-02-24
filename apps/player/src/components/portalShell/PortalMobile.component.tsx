"use client";

import PortalHeader from "@/components/portalHeader/PortalHeader.component";
import BottomNav from "@/components/bottomNav/BottomNav.component";
import styles from "./PortalMobile.module.scss";

type Props = {
  children: React.ReactNode;
};

export default function PortalMobile({ children }: Props) {
  return (
    <div className={styles.shell}>
      <PortalHeader />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </div>
  );
}
