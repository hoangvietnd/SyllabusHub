import { useState } from "react";
import { api } from "../api/client";

export function MaterialUpload({ lessonId }) {
  const [file, setFile] = useState(null);

  const onSubmit = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("lessonId", String(lessonId));
    await api.post("/api/materials/upload", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Tải lên thành công");
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={onSubmit}>Upload</button>
    </div>
  );
}
