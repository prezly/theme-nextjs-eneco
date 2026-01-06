'use client';

import type { Category, Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useCallback } from 'react';

import { FormattedMessage, http, useIntl, useLocale } from '@/adapters/client';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Link } from '@/components/Link';
import { StaggeredLayout } from '@/components/StaggeredLayout';
import { StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';
import { getNewsroomPlaceholderColors } from '@/utils';

import { useStoryCardLayout } from './lib';
import listStyles from './StoriesList.module.scss';
import styles from './CategoryStoriesSection.module.scss';

type Props = {
    anchorId?: string;
    category: Category;
    translatedCategory: { name: string; slug: string; locale: Locale.Code };
    excludedStoryUuids?: string[];
    initialStories: ListStory[];
    layout: ThemeSettings['layout'];
    newsrooms: Newsroom[];
    newsroomUuid: string;
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    total: number;
};

function fetchStories(props: {
    localeCode: Locale.Code;
    offset: number;
    limit: number;
    categoryId: number;
    excludedStoryUuids?: string[];
}) {
    const { localeCode, offset, limit, categoryId, excludedStoryUuids } = props;
    return http.get<{ data: ListStory[]; total: number }>('/api/stories', {
        limit,
        offset,
        locale: localeCode,
        category: categoryId,
        query: excludedStoryUuids && JSON.stringify({ uuid: { $nin: excludedStoryUuids } }),
    });
}

export function CategoryStoriesSection({
    anchorId,
    category,
    translatedCategory,
    excludedStoryUuids,
    initialStories,
    layout,
    newsrooms,
    newsroomUuid,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    total,
}: Props) {
    const locale = useLocale();
    const { formatMessage } = useIntl();
    const { load, loading, data: stories, done } = useInfiniteLoading(
        useCallback(
            (offset) =>
                fetchStories({
                    localeCode: locale,
                    offset,
                    limit: pageSize,
                    categoryId: category.id,
                    excludedStoryUuids,
                }),
            [category.id, excludedStoryUuids, locale, pageSize],
        ),
        { data: initialStories, total },
    );

    const getStoryCardSize = useStoryCardLayout(false);

    if (stories.length === 0) {
        return null;
    }

    return (
        <div className={styles.section}>
            <Link
                href={{
                    routeName: 'category',
                    params: { slug: translatedCategory.slug, localeCode: translatedCategory.locale },
                }}
                className={styles.categoryTitle}
                id={anchorId}
            >
                {translatedCategory.name}
            </Link>

            {layout === 'grid' && (
                <div
                    className={classNames(
                        listStyles.storiesContainer,
                        listStyles.stacked,
                    )}
                >
                    {stories.map((story, index) => {
                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                external={
                                    story.newsroom.uuid !== newsroomUuid
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
                                forceAspectRatio
                                layout="horizontal"
                                placeholder={getNewsroomPlaceholderColors(newsroom)}
                                publishedAt={story.published_at}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                size={getStoryCardSize(index)}
                                slug={story.slug}
                                subtitle={story.subtitle}
                                thumbnailImage={story.thumbnail_image}
                                title={story.title}
                                titleAsString={story.title}
                                translatedCategories={[]}
                                variant={storyCardVariant}
                            />
                        );
                    })}
                </div>
            )}

            {layout === 'masonry' && (
                <StaggeredLayout className={listStyles.staggered}>
                    {stories.map((story) => {
                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                className={listStyles.card}
                                external={
                                    story.newsroom.uuid !== newsroomUuid
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
                                layout="vertical"
                                placeholder={getNewsroomPlaceholderColors(newsroom)}
                                publishedAt={story.published_at}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                size="medium"
                                slug={story.slug}
                                subtitle={story.subtitle}
                                thumbnailImage={story.thumbnail_image}
                                title={story.title}
                                titleAsString={story.title}
                                translatedCategories={[]}
                                variant={storyCardVariant}
                                withStaticImage
                            />
                        );
                    })}
                </StaggeredLayout>
            )}

            {!done && (
                <LoadMoreButton
                    onClick={load}
                    loading={loading}
                    className={styles.loadMore}
                    aria-label={formatMessage(translations.actions.loadMore)}
                />
            )}
        </div>
    );
}

