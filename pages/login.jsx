import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Footer.module.css";
import loginStyles from "../styles/Login.module.css"
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useUserContext } from "@/context";
import { LOGIN_USER } from "@/context/actions";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Login(props) {
  const router = useRouter();
  const { dispatch } = useUserContext()
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });


      if (res.status === 200) {
        console.log("Went here")
        const user = await res.json()
        dispatch({ type: LOGIN_USER, payload: user })
        return router.push("/dashboard");
      }

      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      alert('Login failed')
      console.log(err);
    }
  }
  return (
    <>
      <main className={loginStyles.login}>
        <Image loading="lazy"
          src="/noisy-gradients.png"
          className={loginStyles.bgImg}
          alt="" width={100}
          height={100} />

        <div className={loginStyles.container}>
          <h1 className={loginStyles.title}>Log In</h1>

          <form className={loginStyles.form} onSubmit={handleLogin}>
            <label
              htmlFor="username"
              className={loginStyles.userLabel}
            >User Name</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              value={username}
              className={loginStyles.userValue}
              aria-label={username}
            />
            <div className={loginStyles.divider} />
            <label
              htmlFor="password"
              className={loginStyles.passLabel}
            >Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
              className={loginStyles.passValue}
              aria-label={password}
            />
            <div className={loginStyles.divider} />

            <button className={loginStyles.loginBtn}>Login</button>

          </form>
          <div className={loginStyles.text}>
            Don&#39;t have an account? <Link href="/signup" className={loginStyles.link}>Sign Up</Link>
          </div>

        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>

    </>

  );
}
