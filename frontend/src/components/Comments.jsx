import { useEffect, useState } from "react";
import { getVideoComments, addComment } from "../api/comment.api";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getVideoComments(videoId).then(res =>
      setComments(res.data.data)
    );
  }, [videoId]);

  const submit = async () => {
    const res = await addComment(videoId, text);
    setComments([res.data.data, ...comments]);
    setText("");
  };

  return (
    <div className="mt-4">
      <input
        className="w-full border p-2"
        placeholder="Add a comment"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={submit}>Comment</button>

      {comments.map(c => (
        <p key={c._id}>
          <b>{c.owner.username}</b>: {c.content}
        </p>
      ))}
    </div>
  );
}