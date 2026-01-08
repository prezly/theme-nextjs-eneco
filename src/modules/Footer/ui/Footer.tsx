'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';

import styles from './Footer.module.scss';

interface Props {
    localeCode: Locale.Code;
}

function getFooterLinks(localeCode: Locale.Code) {
    const baseLocale = localeCode.split('_')[0]; // Extract language code (nl, fr, en)

    switch (baseLocale) {
        case 'fr': {
            return {
                terms: {
                    text: 'Conditions générales',
                    href: 'https://cdn.eneco.be/downloads/fr/general/vw/conditions-g%C3%A9n%C3%A9rales.pdf',
                },
                disclaimer: {
                    text: 'Disclaimer',
                    href: 'https://eneco.be/fr/disclaimer',
                },
                privacy: {
                    text: 'Privacy et cookie statement',
                    href: 'https://eneco.be/fr/d%C3%A9claration-de-confidentialit%C3%A9',
                },
                cookies: {
                    text: 'Cookies',
                    href: 'https://eneco.be/fr/cookies',
                },
            };
        }
        case 'en': {
            return {
                terms: {
                    text: 'Terms and conditions',
                    href: 'https://cdn.eneco.be/downloads/nl/general/vw/algemene-voorwaarden.pdf',
                },
                disclaimer: {
                    text: 'Disclaimer',
                    href: 'https://eneco.be/nl/disclaimer',
                },
                privacy: {
                    text: 'Privacy and cookie statement',
                    href: 'https://eneco.be/nl/privacybeleid',
                },
                cookies: {
                    text: 'Cookies',
                    href: 'https://eneco.be/nl/cookies',
                },
            };
        }
        case 'nl':
        default: {
            return {
                terms: {
                    text: 'Algemene voorwaarden',
                    href: 'https://cdn.eneco.be/downloads/nl/general/vw/algemene-voorwaarden.pdf',
                },
                disclaimer: {
                    text: 'Disclaimer',
                    href: 'https://eneco.be/nl/disclaimer',
                },
                privacy: {
                    text: 'Privacy en cookie statement',
                    href: 'https://eneco.be/nl/privacybeleid',
                },
                cookies: {
                    text: 'Cookies',
                    href: 'https://eneco.be/nl/cookies',
                },
            };
        }
    }
}

export function Footer({ localeCode }: Props) {
    const links = getFooterLinks(localeCode);

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {/* Column 1: Logo */}
                    <div className={styles.logoColumn}>
                        <a href="https://eneco.be/" className={styles.logo}>
                            <img
                                src="https://cdn.uc.assets.prezly.com/361cba53-d084-46b0-bc28-7ddb5c833c06/"
                                alt="Eneco"
                                className={styles.logoImage}
                            />
                        </a>
                    </div>

                    {/* Columns 2-5: Links */}
                    <div className={styles.linksWrapper}>
                        <div className={styles.linksColumn}>
                            <a href={links.terms.href} className={styles.link}>
                                {links.terms.text}
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href={links.disclaimer.href} className={styles.link}>
                                {links.disclaimer.text}
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href={links.privacy.href} className={styles.link}>
                                {links.privacy.text}
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href={links.cookies.href} className={styles.link}>
                                {links.cookies.text}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
