import { Locale, Newsrooms } from '@prezly/theme-kit-nextjs';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { analytics, app, generateRootMetadata, themeSettings } from '@/adapters/server';
import { CategoryImageFallbackProvider } from '@/components/CategoryImage';
import { PreviewPageMask } from '@/components/PreviewPageMask';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { WindowScrollListener } from '@/components/WindowScrollListener';
import { Analytics } from '@/modules/Analytics';
import { BoilerplateSubscribe } from '@/modules/BoilerplateSubscribe';
import {
    BroadcastGalleryProvider,
    BroadcastNotificationsProvider,
    BroadcastPageTypesProvider,
    BroadcastStoryProvider,
    BroadcastTranslationsProvider,
} from '@/modules/Broadcast';
import { Contacts } from '@/modules/Contacts';
import { CookieConsentProvider } from '@/modules/CookieConsent';
import { CookieConsent } from '@/modules/CookieConsent/CookieConsent';
import { ContentHubFilters } from '@/modules/ContentHubFilters';
import { Footer } from '@/modules/Footer';
import { FooterLinks } from '@/modules/FooterLinks';
import { Branding, Preconnect } from '@/modules/Head';
import { Header } from '@/modules/Header';
import { IntlProvider } from '@/modules/Intl';
import { Notifications } from '@/modules/Notifications';
import { RoutingProvider } from '@/modules/Routing';

import '@prezly/content-renderer-react-js/styles.css';
import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

import styles from './layout.module.scss';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    children: ReactNode;
}

export async function generateViewport(): Promise<Viewport> {
    const settings = await themeSettings();

    return {
        themeColor: settings.header_background_color,
    };
}

export async function generateMetadata(props: Props) {
    const params = await props.params;
    const newsroom = await app().newsroom();

    const faviconUrl = Newsrooms.getFaviconUrl(newsroom, 180);

    return generateRootMetadata(
        {
            locale: params.localeCode,
            indexable: !process.env.VERCEL,
        },
        {
            icons: {
                shortcut: faviconUrl,
                apple: faviconUrl,
            },
        },
    );
}

export default async function MainLayout(props: Props) {
    const params = await props.params;

    const { children } = props;

    const { code: localeCode, isoCode, direction } = Locale.from(params.localeCode);
    const { isTrackingEnabled } = analytics();
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);

    // Get category slugs for News and Press Releases
    const categories = await app().categories();
    
    // Find NEWS and PRESS RELEASES categories by name (locale-aware)
    const newsNamesByLocale: Partial<Record<Locale.Code, string[]>> = {
        en: ['NEWS'],
        fr: ['NOUVELLES', 'ACTUALITÉS', 'ACTUALITES'],
        nl: ['NIEUWS'],
    };

    const pressReleaseNamesByLocale: Partial<Record<Locale.Code, string[]>> = {
        en: ['PRESS RELEASES', 'PRESS RELEASE'],
        fr: ['COMMUNIQUÉS DE PRESSE', 'COMMUNIQUES DE PRESSE'],
        nl: ['PERSBERICHTEN'],
    };

    const allNewsNames = Object.values(newsNamesByLocale).flat();
    const allPressReleaseNames = Object.values(pressReleaseNamesByLocale).flat();

    const newsCategory = categories.find((category) => {
        const matchesNewsName = Object.values(category.i18n).some((translation) => {
            if (!translation) return false;
            const nameUpper = translation.name.toUpperCase();
            return allNewsNames.includes(nameUpper);
        });
        return matchesNewsName && category.i18n[localeCode]?.public_stories_number > 0;
    });

    const pressReleasesCategory = categories.find((category) => {
        const matchesPressReleaseName = Object.values(category.i18n).some((translation) => {
            if (!translation) return false;
            const nameUpper = translation.name.toUpperCase();
            return allPressReleaseNames.includes(nameUpper);
        });
        return (
            matchesPressReleaseName && category.i18n[localeCode]?.public_stories_number > 0
        );
    });

    const newsCategorySlug = newsCategory?.i18n[localeCode]?.slug;
    const pressReleasesCategorySlug = pressReleasesCategory?.i18n[localeCode]?.slug;

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <AppContext localeCode={localeCode}>
                    {isTrackingEnabled && (
                        <Analytics
                            meta={{
                                newsroom: newsroom.uuid,
                                tracking_policy: newsroom.tracking_policy,
                            }}
                            trackingPolicy={newsroom.tracking_policy}
                            plausible={{
                                isEnabled: newsroom.is_plausible_enabled,
                                siteId: newsroom.plausible_site_id,
                            }}
                            segment={{ writeKey: newsroom.segment_analytics_id }}
                            google={{ analyticsId: newsroom.google_analytics_id }}
                        />
                    )}
                    <Notifications localeCode={localeCode} />
                    <div className={styles.layout}>
                        <Header localeCode={localeCode} />
                        <ContentHubFilters 
                            newsCategorySlug={newsCategorySlug}
                            pressReleasesCategorySlug={pressReleasesCategorySlug}
                        />
                        <main className={styles.content}>{children}</main>
                        <BoilerplateSubscribe localeCode={localeCode} />
                        <Contacts localeCode={localeCode} />
                        <FooterLinks 
                            companyInformation={languageSettings.company_information}
                            localeCode={localeCode}
                        />
                        <Footer localeCode={localeCode} />
                    </div>
                    <ScrollToTopButton />
                    <CookieConsent localeCode={localeCode} />
                    <PreviewPageMask />
                    <WindowScrollListener />
                </AppContext>
            </body>
        </html>
    );
}

async function AppContext(props: { children: ReactNode; localeCode: Locale.Code }) {
    const { localeCode, children } = props;

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
    const brandName = languageSettings.company_information.name || newsroom.name;
    const settings = await app().themeSettings();

    return (
        <RoutingProvider>
            <IntlProvider localeCode={localeCode}>
                <BroadcastStoryProvider>
                    <BroadcastGalleryProvider>
                        <CookieConsentProvider trackingPolicy={newsroom.tracking_policy}>
                            <CategoryImageFallbackProvider
                                image={newsroom.newsroom_logo}
                                text={brandName}
                            >
                                <ThemeSettingsProvider settings={settings}>
                                    <BroadcastPageTypesProvider>
                                        <BroadcastNotificationsProvider>
                                            <BroadcastTranslationsProvider>
                                                {children}
                                            </BroadcastTranslationsProvider>
                                        </BroadcastNotificationsProvider>
                                    </BroadcastPageTypesProvider>
                                </ThemeSettingsProvider>
                            </CategoryImageFallbackProvider>
                        </CookieConsentProvider>
                    </BroadcastGalleryProvider>
                </BroadcastStoryProvider>
            </IntlProvider>
        </RoutingProvider>
    );
}
