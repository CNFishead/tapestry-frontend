import styles from './CommunitySection.module.scss';

const communityMoments = [
  {
    title: 'Discord hub',
    body: 'Placeholder space for the live community entry point, server invite, or featured channels once that destination is ready.',
  },
  {
    title: 'Developer updates',
    body: 'Placeholder space for devlogs, release notes, and the broader rhythm of what the community should expect from the team.',
  },
  {
    title: 'Shared stories',
    body: 'Placeholder space for screenshots, campaign highlights, or play reports that make the community feel active and visible.',
  },
];

export function CommunitySection() {
  return (
    <section id="community" className={styles.section} aria-labelledby="community-title">
      <div className={styles.layout}>
        <div className={styles.spotlight}>
          <p className={styles.kicker}>Community</p>
          <h2 id="community-title">Make the Discord and community layer feel like part of the world, not an afterthought.</h2>
          <p className={styles.description}>This is the community landing block: a clear place to direct people toward conversation, updates, and the social side of the game once those links are ready.</p>
          <div className={styles.callout}>
            <span className={styles.calloutLabel}>Discord placeholder</span>
            <p>The primary community CTA can live here without forcing today’s layout to guess at the final server structure.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {communityMoments.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}