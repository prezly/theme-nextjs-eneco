import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import type { ThemeSettings } from '@/theme-settings';

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
        pagination,
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
            {newsCategory && newsStories.length > 0 && newsCategory.i18n[localeCode] && (
                <CategoryStoriesSection
                    category={newsCategory}
                    translatedCategory={{
                        name: newsCategory.i18n[localeCode]!.name,
                        slug: newsCategory.i18n[localeCode]!.slug,
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
                pressReleasesCategory.i18n[localeCode] && (
                    <CategoryStoriesSection
                        category={pressReleasesCategory}
                        translatedCategory={{
                            name: pressReleasesCategory.i18n[localeCode]!.name,
                            slug: pressReleasesCategory.i18n[localeCode]!.slug,
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

    // Find NEWS and PRESS RELEASES categories by name
    const newsCategory = categories.find((category) => {
        const translation = category.i18n[localeCode];
        return translation && translation.name.toUpperCase() === 'NEWS';
    });

    const pressReleasesCategory = categories.find((category) => {
        const translation = category.i18n[localeCode];
        return (
            translation &&
            (translation.name.toUpperCase() === 'PRESS RELEASES' ||
                translation.name.toUpperCase() === 'PRESS RELEASE')
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
    let newsStories: typeof import('@/types').ListStory[] = [];
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
    let pressReleasesStories: typeof import('@/types').ListStory[] = [];
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
