'use client';

import styles from './Footer.module.scss';

export function Footer() {
    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.columns}>
                    {/* Column 1: Logo */}
                    <div className={styles.logoColumn}>
                        <a href="https://eneco.be/" className={styles.logo}>
                            <img
                                src="https://cdn.uc.assets.prezly.com/361cba53-d084-46b0-bc28-7ddb5c833c06/"
                                alt="Eneco"
                                className={styles.logoImage}
                            />
                        </a>
                    </div>

                    {/* Columns 2-5: Links */}
                    <div className={styles.linksWrapper}>
                        <div className={styles.linksColumn}>
                            <a
                                href="https://cdn.eneco.be/downloads/nl/general/vw/algemene-voorwaarden.pdf"
                                className={styles.link}
                            >
                                Algemene voorwaarden
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href="https://eneco.be/nl/disclaimer" className={styles.link}>
                                Disclaimer
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href="https://eneco.be/nl/privacybeleid" className={styles.link}>
                                Privacy en cookie statement
                            </a>
                        </div>

                        <div className={styles.linksColumn}>
                            <a href="https://eneco.be/nl/cookies" className={styles.link}>
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
