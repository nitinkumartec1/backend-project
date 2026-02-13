import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { uploadVideo } from "../api/video.api";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!videoFile || !thumbnail) {
      setMessage({ type: "error", text: "Files missing" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      setMessage(null);
      await uploadVideo(formData);
      
      setMessage({ type: "success", text: "Video uploaded successfully!" });
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      if (formRef.current) formRef.current.reset();

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Upload New Video</h1>
      
      {message && (
        <div className={`p-4 rounded text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-gray-700 font-bold mb-2">Title</label>
        <input
          className="w-full p-2 border rounded"
          placeholder="Enter video title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter video description"
          rows="3"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Video File</label>
        <div className="border border-dashed border-gray-400 p-4 rounded bg-gray-50">
             <input 
                type="file" 
                accept="video/*" 
                onChange={e => setVideoFile(e.target.files[0])} 
                required 
                disabled={loading}
             />
             <p className="text-xs text-gray-500 mt-1">Supported formats: mp4, mkv, avi</p>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Thumbnail Image</label>
        <div className="border border-dashed border-gray-400 p-4 rounded bg-gray-50">
            <input 
                type="file" 
                accept="image/*" 
                onChange={e => setThumbnail(e.target.files[0])} 
                required 
                disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended size: 1280x720</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Link 
          to="/"
          className={`flex-1 text-center border border-gray-300 text-gray-700 px-4 py-3 rounded font-bold hover:bg-gray-100 transition ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          Home
        </Link>
        <button 
            disabled={loading}
            className={`flex-1 text-white px-4 py-3 rounded font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
            {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </form>
  );
}