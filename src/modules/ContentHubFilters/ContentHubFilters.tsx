'use client';

import classNames from 'classnames';
import { useState } from 'react';

import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { IconArrowRight } from '@/icons';

import styles from './ContentHubFilters.module.scss';

interface FilterItem {
    href: string;
    title: string;
    id?: string;
}

const filterItems: FilterItem[] = [
    { href: '#heading-news', title: 'News' },
    { href: '#heading-press-releases', title: 'Press Releases' },
    { href: '#heading-media-library', title: 'Media Library', id: 'beeldbankAnchorlink' },
    { href: '#heading-contacts', title: 'Contact us', id: 'title_contactslink' },
];

export function ContentHubFilters() {
    const { isMobile } = useDevice();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(filterItems[0]?.title || 'News');

    function toggleMenu() {
        setIsOpen((prev) => !prev);
    }

    function handleFilterClick(item: FilterItem) {
        setSelectedFilter(item.title);
        if (isMobile) {
            setIsOpen(false);
        }
    }

    return (
        <section className={styles.layer}>
            <div className={styles.retain}>
                {/* Desktop version */}
                <div className={styles.desktop}>
                    <ul className={styles.list}>
                        {filterItems.map((item) => (
                            <li key={item.href} className={styles.item}>
                                <Link
                                    href={item.href}
                                    className={styles.link}
                                    title={item.title}
                                    id={item.id}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile version */}
                <div className={classNames(styles.mobile, { [styles.open]: isOpen })}>
                    <button
                        type="button"
                        className={styles.trigger}
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                    >
                        {selectedFilter}
                        <span className={styles.wrapIcon}>
                            <IconArrowRight
                                width={12}
                                height={12}
                                className={styles.icon}
                                aria-hidden="true"
                                focusable="false"
                            />
                        </span>
                    </button>
                    <ul className={styles.list}>
                        {filterItems.map((item) => (
                            <li key={item.href} className={styles.item}>
                                <Link
                                    href={item.href}
                                    className={styles.link}
                                    title={item.title}
                                    id={item.id}
                                    onClick={() => handleFilterClick(item)}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
