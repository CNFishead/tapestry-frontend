import styles from './DialsSection.module.scss';

const dials = [
  {
    title: 'Tone',
    body: 'Placeholder space for a rules dial that pushes the story toward myth, grit, intimacy, or spectacle.',
    fill: '88%',
  },
  {
    title: 'Peril',
    body: 'Placeholder space for how the rules can turn up pressure, consequences, and the feeling of risk at the table.',
    fill: '72%',
  },
  {
    title: 'Mystery',
    body: 'Placeholder space for modules that reward secrecy, clues, and the pace at which information is revealed.',
    fill: '64%',
  },
  {
    title: 'Momentum',
    body: 'Placeholder space for how quickly scenes resolve and how much push the system gives the story between sessions.',
    fill: '81%',
  },
];

export function DialsSection() {
  return (
    <section id="dials" className={styles.section} aria-labelledby="dials-title">
      <div className={styles.layout}>
        <div className={styles.header}>
          <p className={styles.kicker}>Dials</p>
          <h2 id="dials-title">Plug in rules that tune the story.</h2>
          <p className={styles.description}>This block gives the homepage a visual place for modular rules language, with enough structure to later support examples, screenshots, or interactive previews.</p>
        </div>

        <div className={styles.board}>
          {dials.map((dial) => (
            <article key={dial.title} className={styles.dialCard}>
              <div className={styles.dialTopRow}>
                <h3>{dial.title}</h3>
                <span className={styles.dialValue}>{dial.fill}</span>
              </div>
              <div className={styles.meter} aria-hidden="true">
                <span className={styles.meterFill} style={{ width: dial.fill }} />
              </div>
              <p>{dial.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}