import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function BoilerplateSubscribe({ localeCode }: Props) {
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);

    return (
        <ui.BoilerplateSubscribe
            localeCode={localeCode}
            newsroom={newsroom}
            companyInformation={language.company_information}
        />
    );
}

