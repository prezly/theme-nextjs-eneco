import type { NewsroomCompanyInformation } from '@prezly/sdk';

import { SocialMedia } from '@/components/SocialMedia';

import styles from './FooterLinks.module.scss';

interface Props {
    companyInformation: NewsroomCompanyInformation;
}

export function FooterLinks({ companyInformation }: Props) {
    return (
        <section className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {/* Column 1: Useful links */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Useful links</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <a href="https://eneco.be/nl/verhuizen" className={styles.link}>
                                    If you're moving
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://eneco.be/nl/formulieren/zoek-je-distributie-netbeheerder"
                                    className={styles.link}
                                >
                                    Distribution network operator
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://eneco.be/nl/documenten-voor-particulieren"
                                    className={styles.link}
                                >
                                    Documents
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://eneco.be/nl/stroom-gas/tariefkaarten-deze-maand"
                                    className={styles.link}
                                >
                                    Tariff
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: About us */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>About us</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <a href="https://www.werkenbijeneco.be/" className={styles.link}>
                                    Jobs
                                </a>
                            </li>
                            <li>
                                <a href="https://eneco.prezly.com/" className={styles.link}>
                                    Press
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: More Eneco */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>More Eneco</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <a href="https://wind.eneco.be/" className={styles.link}>
                                    Eneco Wind
                                </a>
                            </li>
                            <li>
                                <a href="https://blog.eneco.be/" className={styles.link}>
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="https://eneco.be/omschakelen" className={styles.link}>
                                    Go green
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Eneco */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Follow Eneco</h3>
                        <SocialMedia
                            companyInformation={companyInformation}
                            className={styles.socialMedia}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

