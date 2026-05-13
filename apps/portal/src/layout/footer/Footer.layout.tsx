"use client";

import Link from "next/link";
import { Button } from "@tapestry/ui";
import { BrandMark } from "@/components/brandMark/BrandMark.component";
import { footerNavigationGroups, legalLinks, primaryCallToAction } from "@/layout/navigation/siteNavigation.data";
import styles from "./Footer.module.scss";

function isInternalLink(href: string) {
  return href.startsWith("/");
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.summary}>
            <BrandMark />
            <p className={styles.blurb}>
              Tapestry is the public front door for the platform, with clear paths into player playspaces and storyweaver tooling.
            </p>
            <Button className={styles.cta} size="md" onClick={() => window.location.assign(primaryCallToAction.href)}>
              {primaryCallToAction.label}
            </Button>
          </div>

          <div className={styles.linkColumns}>
            {footerNavigationGroups.map((group) => (
              <section key={group.title} className={styles.group} aria-labelledby={`footer-group-${group.title}`}>
                <h2 id={`footer-group-${group.title}`} className={styles.groupTitle}>
                  {group.title}
                </h2>

                <div className={styles.groupLinks}>
                  {group.links.map((link) =>
                    isInternalLink(link.href) ? (
                      <Link key={link.href} href={link.href} className={styles.groupLink}>
                        <span className={styles.groupLinkLabel}>{link.label}</span>
                        {link.description ? <span className={styles.groupLinkDescription}>{link.description}</span> : null}
                      </Link>
                    ) : (
                      <a key={link.href} href={link.href} className={styles.groupLink}>
                        <span className={styles.groupLinkLabel}>{link.label}</span>
                        {link.description ? <span className={styles.groupLinkDescription}>{link.description}</span> : null}
                      </a>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.legalCopy}>© {year} Tapestry. Built for connected tabletop play.</p>

          <div className={styles.legalLinks}>
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.legalLink}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}