import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Footer.module.css";
import Home from "../styles/Home.module.css"
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import dbConnect from "@/db/connection";



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

export default function Index(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <>
      <main className={Home.container}>
        <img
          loading="lazy"
          src="/Bg-1.png"
          className={Home.bgImg}
          alt="Background"
        />
        <div className={Home.wrappeer}>
          <img
            loading="lazy"
            src="/Bg-2.png"
            className={Home.bgImg}
            alt="Overlay"
          />
          <header className={Home.header}>
            <nav className={Home.nav}>

              <div className={Home.loginBtn}>
                <a href="/login" className="">Login</a>
              </div>

              <img
                loading="lazy"
                src="/Logo.png"
                className={Home.logo}
                alt="logo"
              />
              <div className={Home.signupBtn}>
                <a href="/signup" className="">Sign Up</a>
              </div>
            </nav>
          </header>
          <section className={Home.info}>
            <div className={Home.infoContainer}>
              <div className={Home.textColumn}>
                <div className={Home.text}>
                  <h1 className={Home.title}>What Is AstroFi?</h1>
                  <h2 className={Home.infoTitle}>
                    AstroFi is where the ancient wisdom of astrology meets the modern science of music therapy.
                  </h2>
                  <p className={Home.infoDescrip}>
                    By aligning your daily horoscope with tailored music recommendations, AstroFi creates a personalized experience that enhances your emotional well-being. Each day, discover how the movements of the stars can harmonize with the rhythm of your life, guiding you to a more balanced and inspired existence.
                  </p>
                </div>
              </div>

            </div>

          </section>

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

        </div>
      </main>
    </>



  );
}
