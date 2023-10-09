import Image from "next/image";
import styles from "./navbar.module.css"
import Link from "next/link";


export default function Navbar() {
    return (
        <div className={styles.nav}>
            <Link href='/' className={styles.logoContainer}>
                <span>
                    <Image width={90} height={20}
                        src="/youtube-logo.svg" alt="YouTube Logo" />
                </span>
            </Link>
        </div>
    )
}