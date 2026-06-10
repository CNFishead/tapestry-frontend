import styles from './Resources.module.scss';
import { RunTheGameSection, StartPlayingSection } from './sections';

export function ResourcesFeature() {
  return (
    <main className={styles.page}>
      <div className={styles.stack}>
        <StartPlayingSection />
        <RunTheGameSection />
      </div>
    </main>
  );
}
