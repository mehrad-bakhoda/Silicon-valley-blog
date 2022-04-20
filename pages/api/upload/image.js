import fs from "fs";
import formidable from "formidable";
import path from "path";
import cookie from "cookie";
import { prisma } from "../../../lib/prisma";
import { verify } from "jsonwebtoken";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  var c = 1;
  if (!req.headers.cookie) return res.send({ ok: false, accessToken: "" });
  const getToken = cookie.parse(req.headers.cookie);
  const token = getToken.refreshToken;

  if (!token) return res.send({ ok: false, accessToken: "" });
  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);

    const found = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!found) return res.send({ ok: false, accessToken: "" });
    if (found) {
      const dir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "users",
        `${found.id}`,
        "products",
        `${c}`
      );
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }

      const form = formidable({ multiples: true, uploadDir: dir });
      form.keepExtensions = true;
      form.maxFileSize = 100 * 1024 * 1024;

      form.parse(req, async (err, fields, files) => {
        const fileName = path.basename(files.file.filepath);
        const destination =
          "uploads/users/" + found.id + "/Products/" + c + "/" + fileName;

        // const image = await prisma.image.create({
        //   data: {
        //     path: destination,
        //     // article: {
        //     //   connect: { id: payload.userId },
        //     // },
        //   },
        // });

        c++;
        res.status(200).json({ imageUrl: destination });
      });
    }
  } catch (e) {
    res.json(e);
    res.status(405).end();
  }
}
