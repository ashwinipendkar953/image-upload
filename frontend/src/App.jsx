import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/images`);
        setImages(response.data);
      } catch (error) {
        setMessage("No Image found");
      }
    };

    fetchImages();
  }, [image, images]);

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage("");
      setUploadedImageUrl(response.data.data.imageUrl);
      setMessage(response.data.msg);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Image Uploader</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary w-100" onClick={handleUpload}>
            Upload
          </button>
          {message && (
            <div
              className="mt-3 alert alert-info alert-dismissible fade show"
              role="alert"
            >
              {message}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
        </div>
      </div>

      {uploadedImageUrl && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center">
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="img-thumbnail"
            />
          </div>
        </div>
      )}

      {images?.length > 0 && (
        <div className="row mt-5">
          <h4 className="text-center mb-4">Uploaded Images</h4>
          {images?.map((image) => (
            <div
              className="col-md-3 col-sm-6 mb-4 d-flex justify-content-center"
              key={image._id}
            >
              <img
                src={image.imageUrl}
                alt="Gallery"
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
