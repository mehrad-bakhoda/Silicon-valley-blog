import { prisma } from "../../../../lib/prisma";
import { verify } from "jsonwebtoken";

import cookie from "cookie";

export default async function handle(req, res) {
  const { header, content, tags, ttr, author, preview } = JSON.parse(req.body);

  if ((header && content, author)) {
    if (!req.headers.cookie) {
      res.redirect("/login");
    }
    if (req.headers.cookie) {
      const getToken = cookie.parse(req.headers.cookie);
      const token = getToken.refreshToken;

      if (!token) return res.status(401);
      let payload = null;

      try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
        if (req.query.edit == "true") {
          console.log(req.query.id);
          const edit = await prisma.article.update({
            where: {
              id: parseInt(req.query.id),
            },
            data: {
              title: `${header}`,
              draft: false,
              content: content,
              metaTags: tags,
              ttr: ttr,
              author: author,
              preview: preview,
            },
          });
          if (edit) {
            res.redirect("/blog");
          }
          if (!edit) return res.status(401);
        }
        if (req.query.draft == "true") {
          const save = await prisma.article.create({
            data: {
              title: `${header}`,
              draft: true,
              content: content,
              metaTags: tags,
              ttr: ttr,
              author: author,

              preview: preview,

              user: {
                connect: { id: payload.userId },
              },
            },
          });
          if (save) {
            res.redirect("/blog");
          }
          if (!save) return res.status(401);
        }
        if (req.query.draft == "false") {
          const articles = await prisma.article.findUnique({
            where: {
              title: `${header}`,
            },
          });
          if (articles) {
            return res.status(401);
          }
          if (!articles) {
            const article = await prisma.article.create({
              data: {
                title: `${header}`,
                content: content,
                draft: false,
                metaTags: tags,
                ttr: ttr,
                author: author,

                preview: preview,

                user: {
                  connect: { id: payload.userId },
                },
              },
            });
            if (article) {
              res.redirect("/blog");
            }
            if (!article) return res.status(401);
          }
        }
      } catch (e) {
        console.log(e);
        res.status(401);
        res.redirect("/login");
      }
    }
  }
  return res.status(400);
}
