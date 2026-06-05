import styles from './DifferenceSection.module.scss';

const differentiators = [
  {
    eyebrow: 'Connected play',
    title: 'One platform, multiple surfaces',
    body: 'Placeholder space for the message about campaigns, characters, lore, and administration living in one connected ecosystem.',
  },
  {
    eyebrow: 'Persistent context',
    title: 'Built for the gaps between sessions',
    body: 'Placeholder space for the value story around continuity, memory, and the way campaigns keep moving when the table is apart.',
  },
  {
    eyebrow: 'Table roles',
    title: 'Different views for different jobs',
    body: 'Placeholder space for how players and storyweavers each get focused tools instead of one overloaded workspace.',
  },
];

export function DifferenceSection() {
  return (
    <section id="difference" className={styles.section} aria-labelledby="difference-title">
      <div className={styles.header}>
        <p className={styles.kicker}>What makes Tapestry different</p>
        <h2 id="difference-title">Different by design, not just by feature list.</h2>
        <p className={styles.description}>This block is the positioning layer: a place to explain why the platform feels cohesive before anyone ever opens the player or storyweaver tools.</p>
      </div>

      <div className={styles.grid}>
        {differentiators.map((item) => (
          <article key={item.title} className={styles.card}>
            <p className={styles.cardEyebrow}>{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}