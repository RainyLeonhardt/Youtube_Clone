'use client';

import Image from "next/image";
import styles from "./navbar.module.css"
import Link from "next/link";
import SignIn from "./sign-in";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import Upload from "./upload";


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.logoContainer}>
                <span>
                    <Image width={90} height={20}
                        src="/youtube-logo.svg" alt="YouTube Logo" />
                </span>
            </Link>
            {
                user && <Upload />
            }
            <SignIn user = {user}/>
        </nav>
    );
}