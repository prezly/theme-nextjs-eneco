'use client';

import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    TranslatedCategory,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs';
import type { UploadedImage } from '@prezly/uploadcare';
import { useMeasure } from '@react-hookz/web';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { cloneElement, useEffect, useMemo, useState } from 'react';

import { FormattedMessage, useIntl } from '@/adapters/client';
import { Button, ButtonLink } from '@/components/Button';
import { CategoriesBar } from '@/components/CategoriesBar';
import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { IconClose, IconExternalLink, IconMenu, IconSearch } from '@/icons';
import { useBroadcastedPageTypeCheck } from '@/modules/Broadcast';
import type { ThemeSettings } from '@/theme-settings';
import type { SearchSettings } from '@/types';

import { Categories } from './Categories';
import { Logo } from './Logo';

import styles from './Header.module.scss';

const SearchWidget = dynamic(
    async () => {
        const component = await import('./SearchWidget');
        return { default: component.SearchWidget };
    },
    { ssr: false },
);

interface Props {
    localeCode: Locale.Code;
    newsroom: Newsroom;
    information: NewsroomCompanyInformation;
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    searchSettings?: SearchSettings;
    children?: ReactNode;
    displayedGalleries: number;
    displayedLanguages: number;
    categoriesLayout: ThemeSettings['categories_layout'];
    logoSize: ThemeSettings['logo_size'];
    mainSiteUrl: string | null;
    mainSiteLabel: string | null;
    newsrooms: Newsroom[];
}

export function Header({
    localeCode,
    newsroom,
    information,
    categories,
    translatedCategories,
    searchSettings,
    displayedGalleries,
    displayedLanguages,
    children,
    newsrooms,
    ...props
}: Props) {
    const { formatMessage } = useIntl();
    const { isMobile } = useDevice();
    const searchParams = useSearchParams();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [measurement, headerRef] = useMeasure<HTMLElement>();
    const isSearchPage = useBroadcastedPageTypeCheck('search');
    const isPreviewMode = process.env.PREZLY_MODE === 'preview';

    const shouldShowMenu =
        categories.length > 0 || displayedLanguages > 0 || displayedGalleries > 0;

    function alignMobileHeader() {
        if (!isMobile) {
            return;
        }

        const header = headerRef.current;
        const headerRect = header?.getBoundingClientRect();

        // If header is not on top of the screen (e.g. a cookie banner is shown or user has scrolled down a bit),
        // Align the header with the top of the screen
        if (headerRect && headerRect.top !== 0) {
            window.scrollBy({ top: headerRect.top });
        }
    }

    function toggleMenu() {
        alignMobileHeader();

        // Adding a timeout to update the state only after the scrolling is triggered.
        setTimeout(() => setIsMenuOpen((o) => !o));
    }
    function closeMenu() {
        return setIsMenuOpen(false);
    }

    function toggleSearchWidget(event: MouseEvent) {
        event.preventDefault();
        alignMobileHeader();

        // Adding a timeout to update the state only after the scrolling is triggered.
        setTimeout(() => setSearchOpen((o) => !o));
    }
    function closeSearchWidget() {
        return setSearchOpen(false);
    }

    // Add scroll lock to the body while mobile menu is open
    useEffect(() => {
        document.body.classList.toggle(styles.body, isMenuOpen);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, [isMenuOpen]);

    const newsroomName = information.name || newsroom.display_name;

    const logo = useMemo(() => {
        const newsroomLogoPreview = isPreviewMode && searchParams.get('main_logo');
        if (newsroomLogoPreview) {
            try {
                return JSON.parse(newsroomLogoPreview) as UploadedImage;
            } catch {
                return null;
            }
        }

        return newsroom.newsroom_logo;
    }, [isPreviewMode, newsroom.newsroom_logo, searchParams]);

    const logoSize = useMemo(() => {
        const logoSizePreview = isPreviewMode && searchParams.get('logo_size');
        return logoSizePreview || props.logoSize;
    }, [isPreviewMode, props.logoSize, searchParams]);

    const mainSiteUrl = useMemo(() => {
        const mainSiteUrlPreview = isPreviewMode && validateUrl(searchParams.get('main_site_url'));

        if (mainSiteUrlPreview) {
            return mainSiteUrlPreview;
        }

        if (props.mainSiteUrl) {
            return validateUrl(props.mainSiteUrl);
        }

        return null;
    }, [isPreviewMode, props.mainSiteUrl, searchParams]);

    function getMainSiteLabel() {
        const mainSiteLabelPreview = isPreviewMode && searchParams.get('main_site_label');
        return mainSiteLabelPreview || props.mainSiteLabel;
    }

    const categoriesLayout = useMemo(() => {
        const categoriesLayoutPreview = isPreviewMode && searchParams.get('categories_layout');
        if (categoriesLayoutPreview === 'dropdown' || categoriesLayoutPreview === 'bar') {
            return categoriesLayoutPreview;
        }

        return props.categoriesLayout;
    }, [isPreviewMode, props.categoriesLayout, searchParams]);

    const isCategoriesLayoutBar = categoriesLayout === 'bar';
    const isCategoriesLayoutDropdown = categoriesLayout === 'dropdown' || isMobile;
    const numberOfPublicGalleries = newsroom.public_galleries_number;

    return (
        <>
            <header ref={headerRef} className={styles.container}>
                <div className="container">
                    <nav className={styles.header}>
                        <div className={styles.navigationLeft}>
                            <Link
                                href={{ routeName: 'index', params: { localeCode } }}
                                className={classNames(styles.newsroom, {
                                    [styles.withoutLogo]: !logo,
                                })}
                            >
                                {!logo && <div className={styles.title}>{newsroomName}</div>}
                                {logo && <Logo alt={newsroomName} image={logo} size={logoSize} />}
                            </Link>

                            <div className={styles.navigationWrapper}>
                                {shouldShowMenu && (
                                    <Button
                                        variation="navigation"
                                        icon={isMenuOpen ? IconClose : IconMenu}
                                        className={classNames(styles.navigationToggle, {
                                            [styles.hidden]: isSearchOpen,
                                        })}
                                        onClick={toggleMenu}
                                        aria-expanded={isMenuOpen}
                                        aria-controls="menu"
                                        title={formatMessage(translations.misc.toggleMobileNavigation)}
                                        aria-label={formatMessage(
                                            translations.misc.toggleMobileNavigation,
                                        )}
                                    />
                                )}

                                <div
                                    className={classNames(styles.navigation, {
                                        [styles.open]: isMenuOpen,
                                    })}
                                >
                                    <div role="none" className={styles.backdrop} onClick={closeMenu} />
                                    {/** biome-ignore lint/correctness/useUniqueElementIds: <Header is rendered only once. It's safe to have static id> */}
                                    <ul id="menu" className={styles.navigationInner}>
                                        {/* Item 2: Electricity & gas */}
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href="https://eneco.be/nl/stroom-gas"
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                Electricity & gas
                                            </ButtonLink>
                                        </li>
                                        {/* Item 3: Save Energy */}
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href="https://eneco.be/nl/energie-besparen"
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                Save Energy
                                            </ButtonLink>
                                        </li>
                                        {/* Item 4: Participate */}
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href="https://eneco.be/nl/participeren"
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                Participate
                                            </ButtonLink>
                                        </li>
                                        {/* Item 5: Customer benefits */}
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href="https://eneco.be/nl/klantvoordelen"
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                Customer benefits
                                            </ButtonLink>
                                        </li>
                                        {/* Item 6: Help & Contact */}
                                        <li className={styles.navigationItem}>
                                            <ButtonLink
                                                href="https://eneco.be/nl/contact"
                                                variation="navigation"
                                                className={styles.navigationButton}
                                            >
                                                Help & Contact
                                            </ButtonLink>
                                        </li>
                                    </ul>
                                </div>
                                {searchSettings && (
                                    <SearchWidget
                                        settings={searchSettings}
                                        localeCode={localeCode}
                                        categories={translatedCategories}
                                        dialogClassName={styles.mobileSearchWrapper}
                                        isOpen={isSearchOpen}
                                        isSearchPage={isSearchPage}
                                        onClose={closeSearchWidget}
                                        newsrooms={newsrooms}
                                        newsroomUuid={newsroom.uuid}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.navigationRight}>
                            <ul className={styles.navigationInner}>
                                {/* Item 8: Freelancers */}
                                <li className={styles.navigationItem}>
                                    <ButtonLink
                                        href="https://eneco.be/nl/kmo"
                                        variation="navigation"
                                        className={styles.navigationButton}
                                    >
                                        Freelancers
                                    </ButtonLink>
                                </li>
                                {/* Item 9: Business */}
                                <li className={styles.navigationItem}>
                                    <ButtonLink
                                        href="https://eneco.be/nl/business"
                                        variation="navigation"
                                        className={styles.navigationButton}
                                    >
                                        Business
                                    </ButtonLink>
                                </li>
                                {/* Item 10: My Eneco */}
                                <li className={classNames(styles.navigationItem, styles.myEnecoItem)}>
                                    <ButtonLink
                                        href="https://my.eneco.be/nl/Account/Logon?returnUrl=%2Fnl"
                                        variation="navigation"
                                        className={styles.navigationButton}
                                    >
                                        My Eneco
                                    </ButtonLink>
                                </li>
                                {/* Item 11: Search */}
                                {searchSettings && !newsroom.is_hub && (
                                    <li className={styles.navigationItem}>
                                        <ButtonLink
                                            href={{
                                                routeName: 'search',
                                                params: { localeCode },
                                            }}
                                            variation="navigation"
                                            className={classNames(styles.navigationButton, styles.searchButton)}
                                            icon={IconSearch}
                                            onClick={toggleSearchWidget}
                                            aria-expanded={isSearchOpen}
                                            title={formatMessage(translations.search.title)}
                                            aria-label={formatMessage(translations.search.title)}
                                        />
                                    </li>
                                )}
                            </ul>
                            {children && typeof children === 'object' && 'props' in children
                                ? (
                                    <li className={styles.navigationItem}>
                                        {cloneElement(children as ReactElement, { asListItem: false })}
                                    </li>
                                )
                                : children ? (
                                    <li className={styles.navigationItem}>{children}</li>
                                ) : null}
                        </div>
                    </nav>
                </div>
            </header>
            {isCategoriesLayoutBar && <CategoriesBar translatedCategories={translatedCategories} />}
        </>
    );
}

function humanizeUrl(url: URL) {
    const string = url.hostname.replace(/^www\./, '');
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function validateUrl(url: string | null) {
    if (!url) return null;

    try {
        const normalizedUrl =
            url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

        const parsedUrl = new URL(normalizedUrl);

        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return null;
        }

        return parsedUrl;
    } catch {
        return null;
    }
}
