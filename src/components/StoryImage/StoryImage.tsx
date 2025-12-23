'use client';

import type { UploadedImage } from '@prezly/sdk';
import type { UploadcareImage } from '@prezly/uploadcare';
import UploadcareImageLoader from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import type { ListStory } from '@/types';
import { getUploadcareImage } from '@/utils';

import { getCardImageSizes, getStoryThumbnail, type ImageSize } from './lib';

import styles from './StoryImage.module.scss';

export function StoryImage({
    className,
    fallback,
    forceAspectRatio,
    isStatic = false,
    placeholder,
    placeholderClassName,
    size,
    thumbnailImage,
    title,
}: StoryImage.Props) {
    const image = getStoryThumbnail(thumbnailImage);
    const uploadcareImage = applyAspectRatio(
        getUploadcareImage(image),
        forceAspectRatio,
        size === 'hero',
    );

    if (uploadcareImage) {
        return (
            <div className={classNames(styles.imageContainer, className)}>
                <UploadcareImageLoader
                    fill
                    alt={title}
                    className={classNames(styles.image, {
                        [styles.static]: isStatic,
                    })}
                    src={uploadcareImage.cdnUrl}
                    sizes={getCardImageSizes(size)}
                />
            </div>
        );
    }

    const fallbackImage = getUploadcareImage(fallback.image);

    return (
        <span
            className={classNames(styles.placeholder, placeholderClassName, {
                [styles.static]: isStatic,
            })}
            style={placeholder}
        >
            {fallbackImage ? (
                <UploadcareImageLoader
                    alt="No image"
                    src={fallbackImage.cdnUrl}
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                    width={256}
                    height={64}
                />
            ) : (
                fallback.text
            )}
        </span>
    );
}

export namespace StoryImage {
    export type Props = {
        className?: string;
        fallback: {
            image: UploadedImage | null;
            text: string;
        };
        forceAspectRatio?: number;
        isStatic?: boolean;
        placeholder: {
            color?: string;
            backgroundColor?: string;
        };
        placeholderClassName?: string;
        size: ImageSize;
        thumbnailImage: ListStory['thumbnail_image'];
        title: string;
    };
}

function applyAspectRatio(
    image: UploadcareImage | null,
    aspectRatio: number | undefined,
    isHero = false,
): UploadcareImage | null {
    if (!image || !aspectRatio) {
        return image;
    }

    const actualAspectRatio = image.width / image.height;

    // For hero images, ensure we request images at a minimum size for quality
    // Hero images display at ~71.5% width, so on 1920px screen that's ~1373px
    // We want at least 1920px wide for retina support
    const minHeroWidth = 1920;
    const minHeroHeight = Math.round(minHeroWidth / aspectRatio); // ~1080 for 16:9

    if (actualAspectRatio > aspectRatio) {
        // The image is wider than it should be - crop width
        let targetHeight = image.height;
        let targetWidth = Math.round(image.height * aspectRatio);

        // For hero images, scale up if needed to ensure minimum quality
        if (isHero && targetWidth < minHeroWidth) {
            targetWidth = minHeroWidth;
            targetHeight = minHeroHeight;
        }

        const [width, height] = constrain(targetWidth, targetHeight);
        return image.scaleCrop(width, height, true);
    }

    if (actualAspectRatio < aspectRatio) {
        // The image is taller than it should be - crop height
        let targetWidth = image.width;
        let targetHeight = Math.round(image.width / aspectRatio);

        // For hero images, scale up if needed to ensure minimum quality
        if (isHero && targetWidth < minHeroWidth) {
            targetWidth = minHeroWidth;
            targetHeight = minHeroHeight;
        }

        const [width, height] = constrain(targetWidth, targetHeight);
        return image.scaleCrop(width, height, true);
    }

    // Images already match aspect ratio - but scale up for hero if needed
    if (isHero && image.width < minHeroWidth) {
        const [width, height] = constrain(minHeroWidth, minHeroHeight);
        return image.scaleCrop(width, height, true);
    }

    return image;
}

const MAX_SCALED_SIZE = 3000;

/**
 * Scale down vectors, which has at least one of dimensions > 3000px.
 * This is necessary because Uploadcare scale_crop transformation fails if one of the dimensions is larger than 3000px.
 */
function constrain(width: number, height: number): [number, number] {
    if (width < MAX_SCALED_SIZE && height < MAX_SCALED_SIZE) {
        return [width, height];
    }
    return [
        Math.min(MAX_SCALED_SIZE, Math.round((width / height) * MAX_SCALED_SIZE)),
        Math.min(MAX_SCALED_SIZE, Math.round((height / width) * MAX_SCALED_SIZE)),
    ];
}
