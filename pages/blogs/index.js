import React from "react";
import superjson from "superjson";
import { prisma } from "../../lib/prisma";
import { Container } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import usePagination from "../../components/Pagination";
import { useState } from "react";

import BlogCard from "../../components/BlogCard";
import styles from "../../styles/BlogCard.module.css";

export default function Blogs({ posts }) {
  let [page, setPage] = useState(1);
  const perPage = 10;
  const count = Math.ceil(posts.length / perPage);
  const data = usePagination(posts, perPage);

  const handleChange = (e, p) => {
    setPage(p);
    data.jump(p);
  };
  return (
    <>
      <Container className={styles.container} fixed>
        <h1 className={styles.title}>List of posts</h1>
      </Container>
      {data.currentData().map((post) => {
        return (
          <div key={post.id} className={styles.card}>
            <BlogCard
              title={post.title}
              preview={post.preview}
              author={post.author}
              id={post.id}
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
  );
}

export async function getServerSideProps() {
  const post = await prisma.article.findMany({});
  const { json } = superjson.serialize(post);

  return {
    props: {
      posts: json,
    },
  };
}
