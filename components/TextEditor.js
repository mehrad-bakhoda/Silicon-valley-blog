import dynamic from "next/dynamic";
import Image from "next/image";

// Components
import Loader from "./Loader";
import CheckMark from "./CheckMark";

// Material Ui
import { TextField } from "@mui/material";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { config } from "../lib/joditEditorSettings";

// Dynamic Import
const importJodit = () => import("jodit-react");
const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

const Input = styled("input")({
  display: "none",
});

// Css
import styles from "../styles/TextEditor.module.css";

export default function textEditor({
  access,
  handleSave,
  handlePost,
  handleUpload,
  handleImage,
  createInput,
  addInput,
  createObjectURL,
  url,
  isError,
  loading,
  setContent,
  setHeader,
  arr,
  content,
  article,
  articleTitle,
  setTTR,
  ttr,
  preview,
  setPreview,
  author,
  setAuthor,
}) {
  if (loading) {
    return <Loader />;
  } else {
    if (isError) {
      return <div>NOT AUTHENTICATED</div>;
    } else {
      if (access) {
        return (
          <div>
            <form encType="multipart/form-data" onSubmit={handlePost}>
              <Container maxWidth="lg">
                <p className={styles.header}>Meta Tags</p>
              </Container>

              {/* meta tags*/}
              <Container maxWidth="lg" className={styles.container}>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={addInput}
                  value="description"
                >
                  Description
                </Button>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={addInput}
                  value="social Media"
                >
                  Social Media
                </Button>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={addInput}
                  value="viewport"
                >
                  Viewport
                </Button>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={addInput}
                  value="keywords"
                >
                  Keywords
                </Button>
              </Container>

              {arr &&
                arr.length > 0 &&
                arr.map((item, i) => {
                  return (
                    <div key={i}>
                      {item && (
                        <Container fixed>
                          <label>{item.tag}</label>

                          <TextField
                            className={styles.title}
                            autoComplete="off"
                            variant="standard"
                            onChange={createInput}
                            value={item.value}
                            id={`${i}`}
                            type={item.type}
                          />
                        </Container>
                      )}
                    </div>
                  );
                })}

              {/*  */}

              <Container>
                <Container maxWidth="lg">
                  <p className={styles.header}>Upload Image</p>
                </Container>
                <Container maxWidth="lg" className={styles.container}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImage}
                        name="image"
                      />
                      <Button
                        className={styles.button}
                        variant="contained"
                        component="span"
                      >
                        Select Image
                      </Button>
                    </label>
                    <label htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        onChange={handleImage}
                        name="image"
                      />
                      <IconButton aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Stack>
                </Container>

                {createObjectURL && (
                  <>
                    <Container maxWidth="lg" className={styles.image_container}>
                      <Image
                        width="800px"
                        height="500px"
                        alt="uploaded image"
                        src={createObjectURL}
                        className={styles.image}
                        onClick={(e) => {
                          if (url) {
                            navigator.clipboard.writeText(url);
                          }
                        }}
                      />
                    </Container>
                    <Container maxWidth="sm" className={styles.container}>
                      <Button
                        type="submit"
                        variant="contained"
                        className={styles.submit_buttons}
                        onClick={handleUpload}
                      >
                        Upload
                      </Button>
                    </Container>
                  </>
                )}
              </Container>
              <Container maxWidth="lg">
                <p className={styles.header}>Title</p>
              </Container>

              <Container maxWidth="lg" className={styles.container}>
                <TextField
                  className={styles.title}
                  autoFocus
                  autoComplete="off"
                  name="header"
                  id="standard-basic"
                  label="Blog Title"
                  variant="standard"
                  value={articleTitle}
                  onChange={(e) => {
                    setHeader(e.target.value);
                  }}
                />
              </Container>
              <Container maxWidth="lg">
                <p className={styles.header}>TTR</p>
              </Container>
              <Container maxWidth="lg" className={styles.container}>
                <TextField
                  className={styles.title}
                  autoFocus
                  autoComplete="off"
                  name="ttr"
                  id="standard-basic"
                  label="ttr"
                  variant="standard"
                  value={ttr}
                  onChange={(e) => {
                    setTTR(e.target.value);
                  }}
                />
              </Container>
              <Container maxWidth="lg">
                <p className={styles.header}>Author</p>
              </Container>
              <Container maxWidth="lg" className={styles.container}>
                <TextField
                  className={styles.title}
                  autoFocus
                  autoComplete="off"
                  name="author"
                  id="standard-basic"
                  label="author"
                  variant="standard"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                  }}
                />
              </Container>
              <Container maxWidth="lg">
                <p className={styles.header}>Preview text</p>
              </Container>
              <Container maxWidth="lg" className={styles.container}>
                <TextField
                  className={styles.title}
                  autoFocus
                  autoComplete="off"
                  name="preview"
                  id="standard-basic"
                  label="preview"
                  variant="standard"
                  value={preview}
                  onChange={(e) => {
                    setPreview(e.target.value);
                  }}
                />
              </Container>

              <Container maxWidth="lg">
                <p className={styles.header}>Write Content</p>
              </Container>
              <Container maxWidth="lg">
                <Box sx={{ borderRadius: "16px" }} className={styles.border}>
                  <JoditEditor
                    value={content}
                    config={config}
                    onChange={(c) => {
                      setContent(c);
                    }}
                  />
                </Box>
              </Container>

              <Container maxWidth="lg" className={styles.container}>
                <Stack spacing={0.8} direction="row">
                  <Button
                    type="submit"
                    variant="contained"
                    className={styles.submit_buttons}
                  >
                    Post
                  </Button>
                  <Button
                    variant="contained"
                    className={styles.submit_buttons}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Stack>
              </Container>
              <Container maxWidth="lg">
                {content && (
                  <>
                    <p className={styles.header}>Preview Content</p>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: content }}
                      className={styles.preview}
                    ></div>
                    <hr />
                  </>
                )}
              </Container>
            </form>
          </div>
        );
      } else {
        return <div>Not Authorized to view this page</div>;
      }
    }
  }
}
