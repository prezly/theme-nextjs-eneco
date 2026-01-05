import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';

import { CategoryStoriesSection } from '../InfiniteStories/CategoryStoriesSection';
import { InfiniteStories } from '../InfiniteStories';

interface Props {
    categoryId: Category['id'] | undefined;
    fullWidthFeaturedStory: boolean;
    layout: ThemeSettings['layout'];
    localeCode: Locale.Code;
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export async function Stories({
    categoryId,
    fullWidthFeaturedStory,
    layout,
    localeCode,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);

    const {
        categories,
        stories,
        excludedStoryUuids,
        newsCategory,
        pressReleasesCategory,
        newsStories,
        pressReleasesStories,
        newsPagination,
        pressReleasesPagination,
    } = await getStories({
        categoryId,
        localeCode,
        pageSize,
    });

    // Only show the main (highlighted) story, category sections will be shown separately
    const mainStory = stories[0];

    return (
        <>
            {mainStory && (
        <InfiniteStories
            key={categoryId}
            categories={categories}
            category={categoryId ? { id: categoryId } : undefined}
            excludedStoryUuids={excludedStoryUuids}
            fullWidthFeaturedStory={fullWidthFeaturedStory}
                    initialStories={[mainStory]}
            layout={layout}
            newsroomName={languageSettings.company_information.name || newsroom.name}
            newsrooms={[newsroom]}
            newsroomUuid={newsroom.uuid}
            pageSize={pageSize}
            showDate={showDate}
            showSubtitle={showSubtitle}
            storyCardVariant={storyCardVariant}
                    total={1}
                    withPageTitle={false}
                />
            )}
            {newsCategory &&
                newsStories.length > 0 &&
                newsCategory.i18n[localeCode] &&
                newsCategory.i18n[localeCode]?.slug && (
                    <CategoryStoriesSection
                        anchorId="heading-news"
                        category={newsCategory}
                        translatedCategory={{
                            name: newsCategory.i18n[localeCode]!.name,
                            slug: newsCategory.i18n[localeCode]!.slug!,
                            locale: localeCode,
                        }}
                    excludedStoryUuids={excludedStoryUuids}
                    initialStories={newsStories}
                    layout={layout}
                    newsrooms={[newsroom]}
                    newsroomUuid={newsroom.uuid}
                    pageSize={4}
                    showDate={showDate}
                    showSubtitle={showSubtitle}
                    storyCardVariant={storyCardVariant}
                    total={newsPagination.matched_records_number}
                />
            )}
            {pressReleasesCategory &&
                pressReleasesStories.length > 0 &&
                pressReleasesCategory.i18n[localeCode] &&
                pressReleasesCategory.i18n[localeCode]?.slug && (
                    <CategoryStoriesSection
                        anchorId="heading-press-releases"
                        category={pressReleasesCategory}
                        translatedCategory={{
                            name: pressReleasesCategory.i18n[localeCode]!.name,
                            slug: pressReleasesCategory.i18n[localeCode]!.slug!,
                            locale: localeCode,
                        }}
                        excludedStoryUuids={excludedStoryUuids}
                        initialStories={pressReleasesStories}
                        layout={layout}
                        newsrooms={[newsroom]}
                        newsroomUuid={newsroom.uuid}
                        pageSize={4}
                        showDate={showDate}
                        showSubtitle={showSubtitle}
                        storyCardVariant={storyCardVariant}
                        total={pressReleasesPagination.matched_records_number}
                    />
                )}
        </>
    );
}

async function getStories({
    categoryId,
    localeCode,
    pageSize,
}: {
    categoryId: number | undefined;
    localeCode: Locale.Code;
    pageSize: number;
}) {
    const categories = await app().categories();
    const featuredCategories = categories.filter(
        ({ is_featured, i18n }) => is_featured && i18n[localeCode]?.public_stories_number > 0,
    );

    // Find NEWS and PRESS RELEASES categories by name (locale-aware)
    // Map of category names by locale - collect all known names across all locales
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

    // Collect all known names across all locales for each category type
    const allNewsNames = Object.values(newsNamesByLocale).flat();
    const allPressReleaseNames = Object.values(pressReleaseNamesByLocale).flat();

    // Find categories by matching names across ANY locale, then check if they have a translation for current locale
    const newsCategory = categories.find((category) => {
        // First check if category matches any known news name across all locales
        const matchesNewsName = Object.values(category.i18n).some((translation) => {
            if (!translation) return false;
            const nameUpper = translation.name.toUpperCase();
            return allNewsNames.includes(nameUpper);
        });

        // If it matches, verify it has a translation for the current locale
        return matchesNewsName && category.i18n[localeCode]?.public_stories_number > 0;
    });

    const pressReleasesCategory = categories.find((category) => {
        // First check if category matches any known press release name across all locales
        const matchesPressReleaseName = Object.values(category.i18n).some((translation) => {
            if (!translation) return false;
            const nameUpper = translation.name.toUpperCase();
            return allPressReleaseNames.includes(nameUpper);
        });

        // If it matches, verify it has a translation for the current locale
        return (
            matchesPressReleaseName && category.i18n[localeCode]?.public_stories_number > 0
        );
    });

    let mainStory;
    let excludedStoryUuids: string[] | undefined;

    if (featuredCategories.length > 0) {
        const { stories: pinnedOrMostRecentStories } = await app().stories({
            // We're fetching two stories, so we can later determine if we can
            // show the category filters.
            limit: 2,
            locale: { code: localeCode },
        });

        mainStory = pinnedOrMostRecentStories[0];
        excludedStoryUuids = mainStory ? [mainStory.uuid] : undefined;
    } else {
        const { stories: allStories } = await app().stories({
            limit: 1,
            locale: { code: localeCode },
        });
        mainStory = allStories[0];
        excludedStoryUuids = mainStory ? [mainStory.uuid] : undefined;
    }

    // Fetch stories for NEWS category (max 4, excluding main story)
    let newsStories: ListStory[] = [];
    let newsPagination = { matched_records_number: 0 };
    if (newsCategory && newsCategory.i18n[localeCode]?.public_stories_number > 0) {
        const query = excludedStoryUuids
            ? {
                  uuid: { $nin: excludedStoryUuids },
              }
            : undefined;

        const result = await app().stories({
            categories: [{ id: newsCategory.id }],
            limit: 4,
            locale: { code: localeCode },
            query,
        });
        newsStories = result.stories;
        newsPagination = result.pagination;
    }

    // Fetch stories for PRESS RELEASES category (max 4, excluding main story)
    let pressReleasesStories: ListStory[] = [];
    let pressReleasesPagination = { matched_records_number: 0 };
    if (
        pressReleasesCategory &&
        pressReleasesCategory.i18n[localeCode]?.public_stories_number > 0
    ) {
        const query = excludedStoryUuids
            ? {
                  uuid: { $nin: excludedStoryUuids },
              }
            : undefined;

        const result = await app().stories({
            categories: [{ id: pressReleasesCategory.id }],
            limit: 4,
            locale: { code: localeCode },
            query,
        });
        pressReleasesStories = result.stories;
        pressReleasesPagination = result.pagination;
    }

    // Get main stories list (for category filters if needed)
    if (featuredCategories.length > 0) {
        const query = mainStory
            ? {
                  uuid: { $nin: [mainStory.uuid] },
              }
            : undefined;

        const { stories, pagination } = await app().stories({
            categories: categoryId ? [{ id: categoryId }] : undefined,
            limit: pageSize - 1,
            locale: { code: localeCode },
            query,
        });

        // If there's less than 2 stories in total, we do not provide
        // categories so the filters will not be displayed.
        const hasOneStoryOrLess = !mainStory && stories.length < 2;

        return {
            categories: hasOneStoryOrLess ? undefined : featuredCategories,
            stories: mainStory ? [mainStory, ...stories] : [],
            pagination,
            excludedStoryUuids,
            newsCategory: newsCategory || undefined,
            pressReleasesCategory: pressReleasesCategory || undefined,
            newsStories,
            pressReleasesStories,
            newsPagination,
            pressReleasesPagination,
        };
    }

    const { stories, pagination } = await app().stories({
        limit: pageSize,
        locale: { code: localeCode },
    });

    return {
        stories: mainStory ? [mainStory, ...stories] : stories,
        pagination,
        excludedStoryUuids,
        newsCategory: newsCategory || undefined,
        pressReleasesCategory: pressReleasesCategory || undefined,
        newsStories,
        pressReleasesStories,
        newsPagination,
        pressReleasesPagination,
    };
}
