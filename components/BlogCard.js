import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../styles/BlogCard.module.css";

export default function OutlinedCard({
  title,
  preview,
  id,
  ttr,
  userId,
  author,
}) {
  const card = (
    <div>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
          <br />
        </Typography>
        {author && <div className={styles.subText}>By {author}</div>}
        {!author && <br />}

        {ttr && <div className={styles.subText}>time to read {ttr}`</div>}
        {!ttr && <br />}
        <Typography sx={{ mt: 1.3 }} variant="body2">
          {preview.slice(0, 45)}...
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/blog/${id}`}>
          <Button size="small">Learn More</Button>
        </Link>
        {userId && (
          <Link href={`/blog/authors/${userId}/articles/${id}/edit`}>
            <Button size="small">Edit</Button>
          </Link>
        )}
      </CardActions>
    </div>
  );
  return (
    <Box className={styles.cardBox}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
