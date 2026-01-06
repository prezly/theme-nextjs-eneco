import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import styles from './LoadMoreButton.module.scss';

export interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onResize' | 'onResizeCapture'> {
    loading?: boolean;
}

export const LoadMoreButton = forwardRef<HTMLButtonElement, Props>(
    (
        {
            className,
            type = 'button',
            loading,
            disabled,
            onClick,
            ...attributes
        },
        forwardedRef,
    ) => (
        <button
            ref={forwardedRef}
            type={type}
            className={classNames(styles.loadMoreButton, className, {
                [styles.loading]: loading,
            })}
            onClick={onClick}
            disabled={disabled || loading}
            {...attributes}
        >
            <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.icon}
            >
                <g opacity="0.8">
                    <circle cx="24" cy="24" r="24" fill="#300C38" />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M31.65 18.3334L24 26.5745L16.35 18.3334L14 20.8705L24 31.6667L34 20.8705L31.65 18.3334Z"
                        fill="white"
                    />
                </g>
            </svg>
        </button>
    ),
);

LoadMoreButton.displayName = 'LoadMoreButton';

