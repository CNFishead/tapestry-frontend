import { Button } from "@tapestry/ui";
import styles from "./Roll.modal.module.scss";

type Props = {
  label: string;
  value?: number;
  onClose: () => void;
};

export function RollModal({ label, value, onClose }: Props) {
  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Roll</div>
          <button className={styles.modalClose} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalLabel}>{label}</div>
          <div className={styles.modalValue}>Value: {value ?? "—"}</div>
          <div className={styles.muted}>Roll UX comes next (dice UI + Thread/Resolve spends).</div>
        </div>

        <div className={styles.modalActions}>
          <Button tone="purple" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button tone="gold" onClick={onClose}>
            Roll (stub)
          </Button>
        </div>
      </div>
    </div>
  );
}
