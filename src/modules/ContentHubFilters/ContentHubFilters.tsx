'use client';

import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useLocale, type AppUrlGeneratorParams } from '@/adapters/client';
import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { IconArrowRight } from '@/icons';

import styles from './ContentHubFilters.module.scss';

interface FilterItem {
    href: string | AppUrlGeneratorParams;
    title: string;
    id?: string;
}

interface Props {
    newsCategorySlug?: string;
    pressReleasesCategorySlug?: string;
}

export function ContentHubFilters({ newsCategorySlug, pressReleasesCategorySlug }: Props) {
    const locale = useLocale();
    const { isMobile } = useDevice();
    const pathname = usePathname();
    
    // Check if we're on the root page (index page) - not a category page
    // Root page paths: /, /nl, /en, /fr, /nl/, /en/, /fr/
    // Category page paths: /nl/category/nieuws, /en/category/news, etc.
    const isRootPage = !pathname.includes('/category/');

    const filterItems: FilterItem[] = useMemo(
        () => {
            // Dutch is the default locale at root, so treat anything that's not 'fr' or 'en' as Dutch
            const isFrench = locale === 'fr';
            const isEnglish = locale === 'en';
            const isDutch = !isFrench && !isEnglish;

            // Determine hrefs: use anchors on root page, category links elsewhere
            const newsHref = isRootPage && newsCategorySlug
                ? '#heading-news'
                : newsCategorySlug
                  ? { routeName: 'category' as const, params: { slug: newsCategorySlug, localeCode: locale } }
                  : '#heading-news';
            
            const pressReleasesHref = isRootPage && pressReleasesCategorySlug
                ? '#heading-press-releases'
                : pressReleasesCategorySlug
                  ? { routeName: 'category' as const, params: { slug: pressReleasesCategorySlug, localeCode: locale } }
                  : '#heading-press-releases';

            if (isDutch) {
                return [
                    { href: newsHref, title: 'Nieuws' },
                    { href: pressReleasesHref, title: 'Persberichten' },
                    { href: '#heading-media-library', title: 'Beeldbank', id: 'beeldbankAnchorlink' },
                    { href: '#heading-contacts', title: 'Contacteer ons', id: 'title_contactslink' },
                ];
            }
            if (isFrench) {
                return [
                    { href: newsHref, title: 'Actualités' },
                    { href: pressReleasesHref, title: 'Communiqués de presse' },
                    { href: '#heading-media-library', title: 'Media Library', id: 'beeldbankAnchorlink' },
                    { href: '#heading-contacts', title: 'Contactez-nous', id: 'title_contactslink' },
                ];
            }
            // en (default)
            return [
                { href: newsHref, title: 'News' },
                { href: pressReleasesHref, title: 'Press Releases' },
                { href: '#heading-media-library', title: 'Media Library', id: 'beeldbankAnchorlink' },
                { href: '#heading-contacts', title: 'Contact us', id: 'title_contactslink' },
            ];
        },
        [locale, isRootPage, newsCategorySlug, pressReleasesCategorySlug],
    );

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(filterItems[0]?.title || 'News');

    function toggleMenu() {
        setIsOpen((prev) => !prev);
    }

    function handleFilterClick(item: FilterItem) {
        setSelectedFilter(item.title);
        if (isMobile) {
            setIsOpen(false);
        }
    }

    return (
        <section className={styles.layer}>
            <div className={styles.retain}>
                {/* Desktop version */}
                <div className={styles.desktop}>
                    <ul className={styles.list}>
                        {filterItems.map((item, index) => (
                            <li key={`${item.title}-${index}`} className={styles.item}>
                                <Link
                                    href={item.href}
                                    className={styles.link}
                                    title={item.title}
                                    id={item.id}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile version */}
                <div className={classNames(styles.mobile, { [styles.open]: isOpen })}>
                    <button
                        type="button"
                        className={styles.trigger}
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                    >
                        {selectedFilter}
                        <span className={styles.wrapIcon}>
                            <IconArrowRight
                                width={12}
                                height={12}
                                className={styles.icon}
                                aria-hidden="true"
                                focusable="false"
                            />
                        </span>
                    </button>
                    <ul className={styles.list}>
                        {filterItems.map((item, index) => (
                            <li key={`${item.title}-${index}`} className={styles.item}>
                                <Link
                                    href={item.href}
                                    className={styles.link}
                                    title={item.title}
                                    id={item.id}
                                    onClick={() => handleFilterClick(item)}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
