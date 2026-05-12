import { PortalButtonLink } from "@/components/home/PortalButtonLink.component";
import styles from "@/components/home/Home.module.scss";

const portalLinks = [
  {
    href: "https://player.tapestry-ttrpg.com",
    label: "Player portal",
  },
  {
    href: "https://admin.tapestry-ttrpg.com",
    label: "Storyweaver tools",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.copy}>
          <p className={styles.kicker}>Public portal</p>
          <h1 id="home-title">Tapestry</h1>
          <p className={styles.lede}>
            A living tabletop roleplaying system for stories, characters, and worlds that keep unfolding.
          </p>
          <div className={styles.actions}>
            <PortalButtonLink href="https://player.tapestry-ttrpg.com">Enter the portal</PortalButtonLink>
            <a className={styles.secondaryLink} href="mailto:hello@tapestry-ttrpg.com">
              Contact
            </a>
          </div>
        </div>

        <nav className={styles.linkRail} aria-label="Tapestry portals">
          {portalLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
