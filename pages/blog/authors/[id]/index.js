import React from "react";
import superjson from "superjson";
import { prisma } from "../../../../lib/prisma";
import BlogCard from "../../../../components/BlogCard";
import styles from "../../../../styles/BlogCard.module.css";
import usePagination from "../../../../components/Pagination";
import { Container } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import Loader from "../../../../components/Loader";

export default function Index({ posts, userId }) {
  let [page, setPage] = useState(1);
  const perPage = 10;
  const count = Math.ceil(posts.length / perPage);
  const data = usePagination(posts, perPage);
  const handleChange = (e, p) => {
    setPage(p);
    data.jump(p);
  };
  return posts ? (
    <>
      <Container className={styles.container} fixed>
        <h1 className={styles.title}>List of authors posts</h1>
      </Container>

      {data.currentData().map((post) => {
        return (
          <div key={post.id} className={styles.card}>
            <BlogCard
              title={post.title}
              author={post.author}
              preview={post.preview}
              id={post.id}
              userId={userId}
              ttr={post.ttr}
            />
          </div>
        );
      })}
      <Container className={styles.fixedBottom} fixed>
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Container>
    </>
  ) : (
    <Loader />
  );
}

export async function getServerSideProps(context) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(context.query.id),
    },
  });
  if (user) {
    const post = await prisma.article.findMany({
      where: {
        user: {
          id: parseInt(context.query.id),
        },
      },
    });
    const { json } = superjson.serialize(post);

    return {
      props: {
        posts: json,
        user: user.email,
        userId: user.id,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
