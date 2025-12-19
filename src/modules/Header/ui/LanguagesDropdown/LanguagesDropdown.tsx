'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { analytics } from '@/utils';

import styles from './LanguagesDropdown.module.scss';

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
    asListItem = true,
}: LanguagesDropdown.Props) {
    const selectedOption = options.find((option) => option.code === selected);

    const displayedOptions = [...options].sort((a, b) => a.title.localeCompare(b.title));

    const dropdown = (
        <Dropdown
            label={selectedOption?.title}
            menuClassName={styles.menu}
            buttonClassName={classNames(buttonClassName, styles.button)}
            withMobileDisplay
        >
            {displayedOptions.map(({ code, href, title }) => (
                <DropdownItem
                    key={code}
                    href={href}
                    withMobileDisplay
                    className={classNames({
                        [styles.disabled]: code === selected,
                    })}
                    onClick={() => analytics.track(ACTIONS.SWITCH_LANGUAGE, { code })}
                >
                    {title}
                </DropdownItem>
            ))}
        </Dropdown>
    );

    if (asListItem) {
        return <li className={navigationItemClassName}>{dropdown}</li>;
    }

    return dropdown;
}

export namespace LanguagesDropdown {
    export interface Option {
        code: Locale.Code;
        title: string;
        href: string;
    }

    export interface Props {
        selected?: Option['code'];
        options: Option[];
        buttonClassName?: string;
        navigationItemClassName?: string;
        asListItem?: boolean;
    }
}
