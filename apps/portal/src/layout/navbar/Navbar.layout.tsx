'use client';

import Link from 'next/link';
import { Button } from '@tapestry/ui';
import { BrandMark } from '@/components/brandMark/BrandMark.component';
import { platformLinks, primaryCallToAction, primaryNavigationLinks } from '@/layout/navigation/siteNavigation.data';
import styles from './Navbar.module.scss';

type NavbarProps = {
  isMobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

function navigateTo(href: string) {
  window.location.assign(href);
}

export function Navbar({ isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }: NavbarProps) {
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.inner}>
          <BrandMark />

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {primaryNavigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Button className={styles.desktopCta} size="md" onClick={() => navigateTo(primaryCallToAction.href)}>
              {primaryCallToAction.label}
            </Button>

            <button
              type="button"
              className={[styles.menuButton, isMobileMenuOpen ? styles.menuButtonOpen : ''].filter(Boolean).join(' ')}
              onClick={isMobileMenuOpen ? onCloseMobileMenu : onOpenMobileMenu}
              aria-controls="portal-mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span className={styles.menuButtonLine} aria-hidden="true" />
              <span className={styles.menuButtonLine} aria-hidden="true" />
              <span className={styles.menuButtonLine} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className={[styles.mobileLayer, isMobileMenuOpen ? styles.mobileLayerOpen : ''].filter(Boolean).join(' ')} aria-hidden={!isMobileMenuOpen}>
        <button type="button" className={styles.mobileBackdrop} onClick={onCloseMobileMenu} aria-label="Close navigation overlay" tabIndex={isMobileMenuOpen ? 0 : -1} />

        <div id="portal-mobile-navigation" className={styles.mobileDrawer} role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className={styles.mobileHeader}>
            <BrandMark compact tabIndex={isMobileMenuOpen ? 0 : -1} />

            <button type="button" className={styles.closeButton} onClick={onCloseMobileMenu} aria-label="Close navigation menu" tabIndex={isMobileMenuOpen ? 0 : -1}>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {primaryNavigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.mobileLink} onClick={onCloseMobileMenu} tabIndex={isMobileMenuOpen ? 0 : -1}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.mobilePortalRail}>
            {platformLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.mobilePortalLink} onClick={onCloseMobileMenu} tabIndex={isMobileMenuOpen ? 0 : -1}>
                <span className={styles.mobilePortalLabel}>{link.label}</span>
                {link.description ? <span className={styles.mobilePortalDescription}>{link.description}</span> : null}
              </a>
            ))}
          </div>

          <Button
            className={styles.mobileCta}
            size="lg"
            fullWidth
            onClick={() => {
              onCloseMobileMenu();
              navigateTo(primaryCallToAction.href);
            }}
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            {primaryCallToAction.label}
          </Button>
        </div>
      </div>
    </>
  );
}
