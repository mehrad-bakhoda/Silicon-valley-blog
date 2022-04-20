import React from "react";
import styles from "../styles/HomeCard.module.css";
import Link from "next/link";

export default function HomeCard({ title, preview, blogId }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h3 className={styles.cardHeader}>{title}</h3>
          <p className={styles.cardInfo}>{preview.slice(0, 45)}... </p>
          <Link href={`/blog/${blogId}`}>
            <button className={styles.cardButton}>Read now</button>
          </Link>
        </div>
      </div>
    </>
  );
}
