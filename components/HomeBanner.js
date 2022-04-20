import styles from "../styles/homePage.module.css";
import React from "react";
import Link from "next/link";
export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Post a blog now</h1>

        <h2 className={styles.heroSubtitle}>
          Scroll through thousands of blogs{" "}
        </h2>
        <Link href="/blogs">
          <button type="button" className={styles.heroButton}>
            Search for blogs &raquo;
          </button>
        </Link>
      </div>
    </section>
  );
}
