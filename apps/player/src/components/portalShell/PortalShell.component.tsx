"use client";

import Image from "next/image";
import PortalHeader from "@/components/portalHeader/PortalHeader.component";
import BottomNav from "@/components/bottomNav/BottomNav.component";
import styles from "./PortalShell.module.scss";

export default function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.watermark}>
        <Image
          src="https://res.cloudinary.com/dmc7wmarf/image/upload/v1771775270/ChatGPT_Image_Jan_10_2026_11_32_39_AM_-_Copy_bcpc4f.png"
          alt=""
          fill
          className={styles.watermarkImage}
          priority
        />
      </div>
      <PortalHeader />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </div>
  );
}
