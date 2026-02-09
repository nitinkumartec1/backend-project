import { useState } from "react";
import { uploadVideo } from "../api/video.api";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail) {
      alert("Files missing");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      await uploadVideo(formData);
      alert("Video uploaded");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
      <input
        className="w-full p-2 mb-3 border"
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
      />
      <input type="file" onChange={e => setVideoFile(e.target.files[0])} />
      <input type="file" onChange={e => setThumbnail(e.target.files[0])} />
      <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
        Upload
      </button>
    </form>
  );
}