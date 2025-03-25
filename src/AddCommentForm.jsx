import { useState } from "react";

export default function AddCommentForm({ onAddComment }) {
  const [nameText, setNameText] = useState("");
  const [commentText, setCommentText] = useState("");

  return (
    <div>
      <h3>ADD A COMMEN</h3>

      <label>
        Name:
        <input
          type="text"
          value={nameText}
          placeholder="Enter Name"
          onChange={(e) => setNameText(e.target.value)}
        />
      </label>

      <label>
        Comment:
        <input
          type="text"
          value={commentText}
          placeholder="Add Comment"
          onChange={(e) => setCommentText(e.target.value)}
        />
      </label>

      <button
        onClick={() => {
          onAddComment({ nameText, commentText });
          setNameText("");
          setCommentText("");
        }}
      >
        Add Comment
      </button>
    </div>
  );
}
