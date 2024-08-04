import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Footer.module.css";
import signupStyles from "../styles/Signup.module.css"
import { useRouter } from "next/router";

export default function Signup(props) {
  const router = useRouter();
  const [
    form,
    setForm
  ] = useState({
    username: "",
    password: "",
    zodiac: "",
    "confirm-password": "",
  });

  const { username, password, zodiac, "confirm-password": confirmPassword } = form
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trim(),
    });
  }
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!username) return setError("Must include username");
    if (!zodiac) return setError("Must include zodiac");
    if (password !== confirmPassword) return setError("Passwords must Match");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password, zodiac }),
      });
      if (res.status === 200) return router.push("/dashboard");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <main className={signupStyles.login}>
        <img
          loading="lazy"
          src="/noisy-gradients.png"
          className={signupStyles.bgImg}
          alt=""
        />
        <div className={signupStyles.container}>
          <h1 className={signupStyles.title}>Sign Up</h1>

          <form className={signupStyles.form} onSubmit={handleCreateAccount}>
            <label
              htmlFor="username"
              className={signupStyles.userLabel}
            >User Name</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              value={username}
              className={signupStyles.userValue}
              aria-label={username}
            />
            <div className={signupStyles.divider} />
            <label
              htmlFor="password"
              className={signupStyles.passLabel}
            >Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
              className={signupStyles.passValue}
              aria-label={password}
            />
            <div className={signupStyles.divider} />
            <label className={signupStyles.conPassLabel} htmlFor="confirm-password">Confirm Password </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              onChange={handleChange}
              value={confirmPassword}
              className={signupStyles.passValue}
            />
            <label
              htmlFor={zodiac}
              className={signupStyles.zodiacLabel}
            >Zodiac</label>
            <select className={signupStyles.zodiacValue} name="zodiac" value={zodiac} onChange={handleChange}>
              <option value="">Select your zodiac sign</option>
              <option value="aries">Aries</option>
              <option value="taurus">Taurus</option>
              <option value="gemini">Gemini</option>
              <option value="cancer">Cancer</option>
              <option value="leo">Leo</option>
              <option value="virgo">Virgo</option>
              <option value="libra">Libra</option>
              <option value="scorpio">Scorpio</option>
              <option value="sagittarius">Sagittarius</option>
              <option value="capricorn">Capricorn</option>
              <option value="aquarius">Aquarius</option>
              <option value="pisces">Pisces</option>
            </select>
            <div className={signupStyles.divider} />
            <button className={signupStyles.loginBtn}>Sign Up</button>
            <div className={signupStyles.text}>
              Have an account? <Link href="/login" className={signupStyles.link}>Login</Link>
            </div>
          </form>

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
