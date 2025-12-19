import {
    DEFAULT_THEME_SETTINGS,
    Font,
    getGoogleFontName,
    getRelatedFont,
    type ThemeSettings,
} from '@/theme-settings';
import { withoutUndefined } from '@/utils';

import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    settings: Partial<ThemeSettings>;
}

export function BrandingSettings({ settings }: Props) {
    const compiledSettings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(settings),
        // Force Etelka Medium font regardless of server settings
        font: Font.ETELKA_MEDIUM,
    };

    const primaryGoogleFontName = getGoogleFontName(compiledSettings.font);
    const relatedFont = getRelatedFont(compiledSettings.font);

    let families = [];
    if (primaryGoogleFontName) {
        const primaryFontName = primaryGoogleFontName.replace(' ', '+');
        if (relatedFont) {
            const relatedGoogleFontName = getGoogleFontName(relatedFont);
            if (relatedGoogleFontName) {
                const relatedFontName = relatedGoogleFontName.replace(' ', '+');
                families = [
                    `${primaryFontName}:wght@600`,
                    `${relatedFontName}:wght@400;500;600;700;900`,
                ];
            } else {
                families = [`${primaryFontName}:wght@400;500;600;700;900`];
            }
        } else {
            families = [`${primaryFontName}:wght@400;500;600;700;900`];
        }
    }

    return (
        <>
            {families.length > 0 && (
                <link
                    href={`https://fonts.googleapis.com/css2?display=swap&${families
                        .map((family) => `family=${family}`)
                        .join('&')}`}
                    rel="stylesheet"
                />
            )}

            <InjectCssVariables variables={getCssVariables(compiledSettings)} />
        </>
    );
}
