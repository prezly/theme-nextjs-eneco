import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Boilerplate as Helper, translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { IconBuilding, IconEmail, IconGlobe, IconPhone } from '@/icons';

import { getWebsiteHostname } from '@/modules/Boilerplate/utils';
import { SubscribeFormContent } from '@/modules/SubscribeForm/ui/SubscribeFormContent';

import styles from './BoilerplateSubscribe.module.scss';

interface Props {
    localeCode: Locale.Code;
    newsroom: Pick<Newsroom, 'display_name' | 'uuid' | 'is_subscription_form_enabled' | 'custom_data_request_link' | 'custom_privacy_policy_link'>;
    companyInformation: NewsroomCompanyInformation;
}

export function BoilerplateSubscribe({ localeCode, newsroom, companyInformation }: Props) {
    const hasAboutInformation = Helper.hasAnyAboutInformation(companyInformation);
    const hasContactInformation = Helper.hasAnyContactInformation(companyInformation);
    const hasAddress = Boolean(companyInformation.address);
    const hasPhone = Boolean(companyInformation.phone);
    const hasEmail = Boolean(companyInformation.email);

    if (!hasAboutInformation && !hasContactInformation) {
        return null;
    }

    return (
        <section className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {/* Left side - 60% - About Us */}
                    {hasAboutInformation && (
                        <section aria-labelledby="boilerplate-about-us" className={styles.aboutUs}>
                            <h2 id="boilerplate-about-us" className={styles.heading}>
                                <FormattedMessage
                                    locale={localeCode}
                                    for={translations.boilerplate.title}
                                    values={{
                                        companyName:
                                            companyInformation.name || newsroom.display_name,
                                    }}
                                />
                            </h2>
                            {companyInformation.about && (
                                <div
                                    className={styles.about}
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <...>
                                    dangerouslySetInnerHTML={{ __html: companyInformation.about }}
                                />
                            )}
                        </section>
                    )}

                    {/* Right side - 40% - Subscribe Form (top) and Contacts (bottom) */}
                    <div className={styles.rightColumn}>
                        {/* Subscribe Form */}
                        {newsroom.is_subscription_form_enabled && (
                            <div className={styles.subscribeFormWrapper}>
                                <SubscribeFormContent
                                    newsroom={{
                                        uuid: newsroom.uuid,
                                        custom_data_request_link: newsroom.custom_data_request_link,
                                        custom_privacy_policy_link: newsroom.custom_privacy_policy_link,
                                    }}
                                    localeCode={localeCode}
                                />
                            </div>
                        )}

                        {/* Contacts */}
                        {hasContactInformation && (
                            <section aria-labelledby="boilerplate-contacts" className={styles.contacts}>
                                <h2 id="boilerplate-contacts" className={styles.heading}>
                                    <FormattedMessage
                                        locale={localeCode}
                                        for={translations.boilerplate.contact}
                                    />
                                </h2>
                                {hasAddress && (
                                    <p className={styles.contact}>
                                        <IconBuilding
                                            aria-hidden
                                            width={16}
                                            height={16}
                                            className={styles.icon}
                                        />
                                        {companyInformation.address}
                                    </p>
                                )}
                                {hasPhone && (
                                    <p className={styles.contact}>
                                        <IconPhone
                                            aria-hidden
                                            width={16}
                                            height={16}
                                            className={styles.icon}
                                        />
                                        <a
                                            className={styles.link}
                                            href={`tel:${companyInformation.phone}`}
                                        >
                                            {companyInformation.phone}
                                        </a>
                                    </p>
                                )}
                                {hasEmail && (
                                    <p className={styles.contact}>
                                        <IconEmail
                                            aria-hidden
                                            width={16}
                                            height={16}
                                            className={styles.icon}
                                        />
                                        <a
                                            className={styles.link}
                                            href={`mailto:${companyInformation.email}`}
                                        >
                                            {companyInformation.email}
                                        </a>
                                    </p>
                                )}
                                {companyInformation.website && (
                                    <p className={styles.contact}>
                                        <IconGlobe
                                            aria-hidden
                                            width={16}
                                            height={16}
                                            className={styles.icon}
                                        />
                                        <a
                                            href={companyInformation.website}
                                            className={styles.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {getWebsiteHostname(companyInformation.website)}
                                        </a>
                                    </p>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

