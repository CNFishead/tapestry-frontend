import styles from './HowItPlaysSection.module.scss';

const steps = [
  {
    label: 'Gather',
    title: 'Frame the campaign',
    body: 'Placeholder space for the setup beat: who is at the table, what the current thread is, and what context people need before the story moves again.',
  },
  {
    label: 'Weave',
    title: 'Share context between sessions',
    body: 'Placeholder space for how posts, lore, rules, and updates stay attached to the campaign instead of being scattered across side channels.',
  },
  {
    label: 'Play',
    title: 'Step into the right surface',
    body: 'Placeholder space for the player and storyweaver experiences: focused tools, tailored views, and fewer distractions when it is time to act.',
  },
  {
    label: 'Archive',
    title: 'Carry the story forward',
    body: 'Placeholder space for how outcomes, notes, and new hooks become the next session’s starting point instead of disappearing after the night ends.',
  },
];

export function HowItPlaysSection() {
  return (
    <section id="how-it-plays" className={styles.section} aria-labelledby="how-it-plays-title">
      <div className={styles.header}>
        <p className={styles.kicker}>How it plays</p>
        <h2 id="how-it-plays-title">A simple story loop the site can explain at a glance.</h2>
        <p className={styles.description}>This section is shaped like a sequence so future copy, screenshots, or video callouts can drop in without changing the homepage structure.</p>
      </div>

      <ol className={styles.track}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.stepCard}>
            <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
            <p className={styles.stepLabel}>{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}