import type { Locale, NewsroomCompanyInformation } from '@prezly/sdk';

import { SocialMedia } from '@/components/SocialMedia';

import styles from './FooterLinks.module.scss';

interface Props {
    companyInformation: NewsroomCompanyInformation;
    localeCode: Locale.Code;
}

interface LinkItem {
    text: string;
    href: string;
}

interface FooterLinksData {
    col1Title: string;
    col1Links: LinkItem[];
    col2Title: string;
    col2Links: LinkItem[];
    col3Title: string;
    col3Links: LinkItem[];
    col4Title: string;
}

function getFooterLinksData(localeCode: Locale.Code): FooterLinksData {
    const isFrench = localeCode === 'fr';
    const isEnglish = localeCode === 'en';
    // Dutch is the default/main language, so treat anything that's not French or English as Dutch
    const isDutch = !isFrench && !isEnglish;

    if (isFrench) {
        return {
            col1Title: 'Liens pratiques',
            col1Links: [
                {
                    text: 'Déménager',
                    href: 'https://eneco.be/fr/d%C3%A9m%C3%A9nager',
                },
                {
                    text: 'Gestionnaire de réseau',
                    href: 'https://eneco.be/fr/formulaires/recherchez-votre-gestionnaire-de-r%C3%A9seau-de-distribution',
                },
                {
                    text: 'Documents',
                    href: 'https://eneco.be/fr/documents-pour-les-particuliers',
                },
                {
                    text: 'Cartes tarifaires de ce mois',
                    href: 'https://eneco.be/fr/%C3%A9lectricit%C3%A9-gaz/cartes-tarifaires-de-ce-mois',
                },
            ],
            col2Title: 'À propos',
            col2Links: [
                {
                    text: 'Travailler chez Eneco',
                    href: 'https://www.werkenbijeneco.be/',
                },
                {
                    text: 'Presse',
                    href: 'https://eneco.prezly.com/fr',
                },
            ],
            col3Title: "Plus d'Eneco",
            col3Links: [
                {
                    text: 'Eneco Wind',
                    href: 'https://wind.eneco.be/fr',
                },
                {
                    text: 'Blog',
                    href: 'https://blog.eneco.be/fr/',
                },
                {
                    text: 'Passer au vert',
                    href: 'https://eneco.be/passer-au-vert',
                },
            ],
            col4Title: "Suivez Eneco",
        };
    }

    if (isDutch) {
        return {
            col1Title: 'Handige links',
            col1Links: [
                {
                    text: 'Verhuizen',
                    href: 'https://eneco.be/nl/verhuizen',
                },
                {
                    text: 'Distributienetbeheerder',
                    href: 'https://eneco.be/nl/formulieren/zoek-je-distributie-netbeheerder',
                },
                {
                    text: 'Documenten',
                    href: 'https://eneco.be/nl/documenten-voor-particulieren',
                },
                {
                    text: 'Tariefkaarten',
                    href: 'https://eneco.be/nl/stroom-gas/tariefkaarten-deze-maand',
                },
            ],
            col2Title: 'Over ons',
            col2Links: [
                {
                    text: 'Jobs',
                    href: 'https://www.werkenbijeneco.be/',
                },
                {
                    text: 'Pers',
                    href: 'https://eneco.prezly.com/',
                },
            ],
            col3Title: 'Meer Eneco',
            col3Links: [
                {
                    text: 'Eneco Wind',
                    href: 'https://wind.eneco.be/',
                },
                {
                    text: 'Blog',
                    href: 'https://blog.eneco.be/',
                },
                {
                    text: 'Samen omschakelen',
                    href: 'https://eneco.be/omschakelen',
                },
            ],
            col4Title: 'Volg Eneco',
        };
    }

    // English (default)
    return {
        col1Title: 'Useful links',
        col1Links: [
            {
                text: "If you're moving",
                href: 'https://eneco.be/nl/verhuizen',
            },
            {
                text: 'Distribution network operator',
                href: 'https://eneco.be/nl/formulieren/zoek-je-distributie-netbeheerder',
            },
            {
                text: 'Documents',
                href: 'https://eneco.be/nl/documenten-voor-particulieren',
            },
            {
                text: 'Tariff',
                href: 'https://eneco.be/nl/stroom-gas/tariefkaarten-deze-maand',
            },
        ],
        col2Title: 'About us',
        col2Links: [
            {
                text: 'Jobs',
                href: 'https://www.werkenbijeneco.be/',
            },
            {
                text: 'Press',
                href: 'https://eneco.prezly.com/',
            },
        ],
        col3Title: 'More Eneco',
        col3Links: [
            {
                text: 'Eneco Wind',
                href: 'https://wind.eneco.be/',
            },
            {
                text: 'Blog',
                href: 'https://blog.eneco.be/',
            },
            {
                text: 'Go green',
                href: 'https://eneco.be/omschakelen',
            },
        ],
        col4Title: 'Follow Eneco',
    };
}

export function FooterLinks({ companyInformation, localeCode }: Props) {
    const data = getFooterLinksData(localeCode);

    return (
        <section className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {/* Column 1: Useful links */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>{data.col1Title}</h3>
                        <ul className={styles.linkList}>
                            {data.col1Links.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={styles.link}>
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: About us */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>{data.col2Title}</h3>
                        <ul className={styles.linkList}>
                            {data.col2Links.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={styles.link}>
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: More Eneco */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>{data.col3Title}</h3>
                        <ul className={styles.linkList}>
                            {data.col3Links.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={styles.link}>
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Follow Eneco */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>{data.col4Title}</h3>
                        <SocialMedia
                            companyInformation={companyInformation}
                            className={styles.socialMedia}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

