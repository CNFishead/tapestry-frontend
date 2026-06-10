import styles from './Resources.module.scss';
import { StartPlayingSection } from './sections';

export function ResourcesFeature() {
  return (
    <main className={styles.page}>
      <div className={styles.stack}>
        <StartPlayingSection />
      </div>
    </main>
  );
}
