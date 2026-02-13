import { useEffect, useState } from "react";
import { getVideoComments, addComment } from "../api/comment.api";
import { useAuth } from "../context/AuthContext";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    getVideoComments(videoId).then(res => {
        // Backend returns: { comments: [...], page, limit, ... }
        setComments(res.data.data.comments || []);
    });
  }, [videoId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
        const res = await addComment(videoId, text);
        // Backend key for new comment might be 'comment' based on controller
        const newComment = res.data.data.comment; 
        // Manually populate owner for immediate display if backend didn't do it fully (though controller seems to populate)
        if (!newComment.owner && user) {
            newComment.owner = user;
        }
        setComments([newComment, ...comments]);
        setText("");
    } catch (error) {
        console.error("Failed to add comment", error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>
      
      {user ? (
        <form onSubmit={submit} className="flex gap-4 mb-8">
            <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <input
                    className="w-full border-b border-gray-300 focus:border-black p-2 outline-none bg-transparent transition"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button 
                        type="submit"
                        disabled={!text.trim()}
                        className={`px-4 py-2 rounded-full font-medium ${text.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                        Comment
                    </button>
                </div>
            </div>
        </form>
      ) : (
          <p className="mb-6 text-gray-500">Please login to comment.</p>
      )}

      <div className="space-y-6">
        {comments.map(c => (
            <div key={c._id} className="flex gap-4">
                <img 
                    src={c.owner?.avatar || "https://via.placeholder.com/40"} 
                    alt={c.owner?.username || "User"} 
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">@{c.owner?.username || "Unknown"}</span>
                        <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 mt-1">{c.content}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}