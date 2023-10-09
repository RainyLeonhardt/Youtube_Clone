import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from './sign-in.module.css';
import { User } from "firebase/auth";

interface SingInProps {
    user: User | null;
}

export default function SignIn({ user }: SingInProps) {
    return (
        <Fragment>
            {user ?
                (
                    <button className={styles.signin} onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )
            }
        </Fragment>
    )
}