import Head from "next/head";
import superjson from "superjson";
import { prisma } from "../../../lib/prisma";
import Loader from "../../../components/Loader";

export default function Post({ blog }) {
  return blog ? (
    <>
      <Head>
        {blog.metaTags.map((tag) => {
          return (
            <meta
              key={tag.value}
              name={`${tag.tag}`}
              content={`${tag.value}`}
            />
          );
        })}
        <title>{blog.title}</title>
      </Head>

      <div key={blog.id}>
        <span dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </>
  ) : (
    <Loader />
  );
}
export async function getServerSideProps(context) {
  const post = await prisma.article.findUnique({
    where: {
      id: parseInt(context.query.id),
    },
  });
  if (post) {
    const { json } = superjson.serialize(post);

    return {
      props: {
        blog: json,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
