import type { Locale } from '@prezly/theme-kit-nextjs';

import * as ui from './ui';

interface Props {
    localeCode: Locale.Code;
}

export async function Footer({ localeCode }: Props) {
    return <ui.Footer localeCode={localeCode} />;
}
