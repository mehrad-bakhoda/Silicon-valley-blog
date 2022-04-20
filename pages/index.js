import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import { verify } from "jsonwebtoken";
import HomeBanner from "../components/HomeBanner";
import HomeCard from "../components/HomeCard";
import superjson from "superjson";
import { prisma } from "../lib/prisma";
import styles from "../styles/HomeCard.module.css";
import HomeFooter from "../components/HomeFooter";

import cookie from "cookie";
function PositionedMenu({ userId, articles }) {
  const [auth, setAuth] = useState(false);
  const token = useSelector((state) => state.token.value);
  useEffect(() => {
    if (token.accessToken !== null) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token.accessToken]);

  if (auth) {
    return (
      <>
        <NavBar authenticate={true} id={userId} />
        <HomeBanner />
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            {!articles ||
              (articles.length == 0 && (
                <div className={styles.container}>No content available</div>
              ))}
            {articles.map((article) => {
              return (
                <HomeCard
                  key={article.id}
                  title={article.title}
                  preview={article.preview}
                  blogId={article.id}
                />
              );
            })}
          </div>
          <HomeFooter />
        </div>
      </>
    );
  } else {
    return (
      <>
        <NavBar authenticate={false} id={userId} />
        <HomeBanner />
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            {!articles ||
              (articles.length == 0 && (
                <div className={styles.container}>No content available</div>
              ))}
            {articles.map((article) => {
              return (
                <HomeCard
                  key={article.id}
                  title={article.title}
                  preview={article.preview}
                  blogId={article.id}
                />
              );
            })}
          </div>
          <HomeFooter />
        </div>
      </>
    );
  }
}

export default PositionedMenu;

export async function getServerSideProps({ req }) {
  const article = await prisma.article.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    take: 4,
  });

  const { json } = superjson.serialize(article);

  if (req.headers.cookie) {
    const getToken = cookie.parse(req.headers.cookie);
    const token = getToken.refreshToken;

    let payload = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
      return {
        props: {
          userId: payload.userId,
          articles: json,
        },
      };
    } catch (e) {
      return {
        props: {
          userId: null,
          articles: json,
        },
      };
    }
  }
  return {
    props: {
      userId: null,
      articles: json,
    },
  };
}
