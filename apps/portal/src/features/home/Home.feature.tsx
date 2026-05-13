import { platformLinks, primaryCallToAction, secondaryCallToAction } from '@/layout/navigation/siteNavigation.data';
import styles from './Home.module.scss';

const valuePillars = [
  {
    title: 'One living platform',
    body: 'Bring your campaigns, characters, and lore together instead of scattering them across disconnected tools.',
  },
  {
    title: 'Built for returning play',
    body: 'Give groups a place where the story keeps moving between game nights and every session picks up with context intact.',
  },
  {
    title: 'Tools for both sides of the table',
    body: 'Players step into play-ready spaces while storyweavers manage worldbuilding, content, and release flow.',
  },
];

export function HomeFeature() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.copy}>
          <p className={styles.kicker}>Marketplace portal</p>
          <h1 id="home-title">Tapestry keeps your tabletop world alive between sessions.</h1>
          <p className={styles.lede}>Discover the platform, see why connected play matters, and move directly into the surfaces where players and storyweavers work.</p>

          <div className={styles.actions}>
            <a className={styles.primaryAction} href={primaryCallToAction.href}>
              {primaryCallToAction.label}
            </a>
            <a className={styles.secondaryAction} href={secondaryCallToAction.href}>
              {secondaryCallToAction.label}
            </a>
          </div>
        </div>

        <aside className={styles.spotlight} aria-label="Tapestry highlights">
          <p className={styles.spotlightLabel}>Why teams buy into it</p>
          <ul className={styles.spotlightList}>
            <li>Campaigns, characters, and lore stay in one connected ecosystem.</li>
            <li>Players and storyweavers get tailored tools instead of one overloaded interface.</li>
            <li>The public site can grow into storefront, roadmap, and release messaging over time.</li>
          </ul>
        </aside>
      </section>

      <section id="why-tapestry" className={styles.section} aria-labelledby="why-title">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionKicker}>Why Tapestry</p>
          <h2 id="why-title">A front door that explains the platform before people ever log in.</h2>
          <p className={styles.sectionCopy}>This first slice keeps the messaging lean, but it establishes the shell that later pages can inherit as the marketplace grows.</p>
        </div>

        <div className={styles.valueGrid}>
          {valuePillars.map((pillar) => (
            <article key={pillar.title} className={styles.valueCard}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="portals" className={styles.section} aria-labelledby="portals-title">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionKicker}>Portal entry points</p>
          <h2 id="portals-title">Choose the surface that matches how you use Tapestry.</h2>
        </div>

        <div className={styles.portalGrid}>
          {platformLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.portalCard}>
              <span className={styles.portalLabel}>{link.label}</span>
              {link.description ? <span className={styles.portalDescription}>{link.description}</span> : null}
              <span className={styles.portalMeta}>Open destination</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
