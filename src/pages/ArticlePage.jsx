import { useParams, useLoaderData } from "react-router-dom";
import articles from "../article-content";
import axios from "axios";
import CommentsList from "../CommentsList";
import { useState } from "react";
import AddCommentForm from "../AddCommentForm";
import useUser from "../useUser";

export default function ArticlePage() {
  const { name } = useParams();
  const { upvotes: initialUpvotes, comments: initialComments } =
    useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);
  const {isLoading, user} = useUser();

  const article = articles.find((a) => a.name === name);

  // upvote posting to endpoint
  async function onUpvoteClicked() {
    const token = user && (await user.getIdToken());
    const headers = token ? { authToken: token } : {};

    console.log(token, headers, "data");
    
    const response = await axios.post(`/api/articles/${name}/upvote`, null, {
      headers,
    });
    setUpvotes(response.data.upvotes);
  }

  // comment posting to endpoint
  async function onAddComment({ nameText, commentText }) {
    const token = user && (await user.getIdToken());
    const headers = token ? { authToken: token } : {};
    const response = await axios.post(
      `/api/articles/${name}/comments`,
      {
        postedBy: nameText,
        text: commentText,
      },
      { headers }
    );
    setComments(response.data.comments);
  }

  return (
    <>
      <h1>this is the {article.title}</h1>
      {user && <button onClick={onUpvoteClicked}>Upvotes</button>}
      <p>my upvotes {upvotes}</p>
      {article.content.map((p) => (
        <p key={p}>{p}</p>
      ))}

      {user ? (
        <AddCommentForm onAddComment={onAddComment} />
      ) : (
        <p>Login to add a comment</p>
      )}

      <CommentsList comments={comments} />
    </>
  );
}

export async function loader({ params }) {
  const resp = await axios.get(`/api/articles/${params.name}`);
  const { upvotes, comments } = resp.data;
  return { upvotes, comments };
}
