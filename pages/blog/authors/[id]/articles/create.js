import React, { useState, useEffect } from "react";

// Installed libraries
import { useSelector } from "react-redux";
import useSWR from "swr";
import axios from "axios";

// Local modules
import { prisma } from "../../../../../lib/prisma";
import checkAuthClient from "../../../../../functions/checkAuthClient";
import checkUser from "../../../../../functions/checkUser";
import TextEditor from "../../../../../components/textEditor";

function CreateABlog({ access }) {
  // useStates

  const [arr, setArr] = useState([]);
  const [image, setImage] = useState(undefined);
  const [createObjectURL, setCreateObjectURL] = useState(undefined);
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState(undefined);
  const [isError, setError] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [content, setContent] = useState("");
  const [header, setHeader] = useState("New Blog Post");
  const [ttr, setTTR] = useState("");
  const [author, setAuthor] = useState("");
  const [preview, setPreview] = useState("");

  const token = useSelector((state) => state.token.value);

  //useEffects

  useEffect(() => {
    if (data) setSecret(data.data);
    if (error) setError(error);
    setLoading(false);
  }, [data, error]);

  // Authentication

  const fetcher = async () => {
    return await axios.get("/api/protectedRoute", {
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
    });
  };
  const { data, error } = useSWR("/api/", fetcher);

  // Form body

  const body = { content, header, ttr, preview, author };

  // Functions

  const addInput = (e) => {
    setArr((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
          tag: e.target.value,
        },
      ];
    });
  };

  const createInput = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  };

  //Handlers

  const handleImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];

      setImage(image);
      setCreateObjectURL(URL.createObjectURL(image));
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const body = new FormData();
    body.append("file", image);
    const res = await fetch(`/api/upload/image`, {
      method: "POST",
      body,
    });
    const response = await res.json();
    setUrl(process.cwd() + response.imageUrl);
  };

  const handlePost = (e) => {
    body.tags = arr;

    fetch(`/api/blog/author/post?draft=false`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response) {
        if (response.status === 200) {
          alert("added successfully");
        }
      }
    });
  };

  const handleSave = async (e) => {
    body.tags = arr;
    fetch(`/api/blog/author/post?draft=true`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response) {
        if (response.status === 200) {
          alert("saved successfully");
        }
      }
    });
  };

  // Render
  return (
    <TextEditor
      access={access}
      handleSave={handleSave}
      handlePost={handlePost}
      handleUpload={handleUpload}
      handleImage={handleImage}
      createInput={createInput}
      addInput={addInput}
      createObjectURL={createObjectURL}
      url={url}
      isError={isError}
      loading={loading}
      setContent={setContent}
      setHeader={setHeader}
      arr={arr}
      content={content}
      ttr={ttr}
      setTTR={setTTR}
      preview={preview}
      setPreview={setPreview}
      author={author}
      setAuthor={setAuthor}
    />
  );
}

// Server-side rendering Functions

export default checkAuthClient(CreateABlog);
export async function getServerSideProps(context) {
  const checkIfExist = await prisma.user.findUnique({
    where: {
      id: parseInt(context.query.id),
    },
  });
  if (checkIfExist) {
    if (context.req.headers.cookie) {
      let payload = checkUser(context.req.headers.cookie);

      if (payload.userId == checkIfExist.id) {
        return {
          props: {
            access: true,
          },
        };
      }
    }
  }
  return {
    notFound: true,
  };
}
