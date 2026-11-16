import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [urls, setUrls] = useState([]);

  const navigate = useNavigate();

  // Points to https://shortify-backend-3ycl.onrender.com in production
  const BACKEND_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const fetchMyUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/url/my-urls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const urlList = Array.isArray(response.data)
        ? response.data
        : response.data.urls || [];
      setUrls(urlList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyUrls();
  }, []);

  const handleCreateUrl = async (e) => {
    if (e) e.preventDefault();

    if (!originalUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/url/create",
        {
          originalUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShortCode(response.data.shortCode);
      setOriginalUrl("");

      fetchMyUrls();

      alert("URL Created Successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create URL");
    }
  };

  const handleCopy = (codeToCopy = shortCode) => {
    const shortUrl = `${BACKEND_URL}/${codeToCopy}`;
    navigator.clipboard.writeText(shortUrl);
    alert("Copied!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Shortify Dashboard</h1>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Create URL</h2>

        <form onSubmit={handleCreateUrl}>
          <input
            type="url"
            required
            placeholder="Paste URL (e.g., https://github.com)"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "6px",
              border: "1px solid #475569",
              backgroundColor: "#0f172a",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Create Short URL
          </button>
        </form>

        {shortCode && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#334155",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>Your New URL</h3>

            <p style={{ marginTop: "6px" }}>
              <a
                href={`${BACKEND_URL}/${shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#60a5fa", textDecoration: "underline" }}
              >
                {`${BACKEND_URL}/${shortCode}`}
              </a>
            </p>

            <button
              onClick={() => handleCopy(shortCode)}
              style={{
                padding: "8px 14px",
                marginTop: "10px",
                cursor: "pointer",
                backgroundColor: "#10b981",
                color: "#0f172a",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Copy URL
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>My URLs</h2>

        {urls.length === 0 ? (
          <p style={{ marginTop: "10px", color: "#94a3b8" }}>
            No URLs Created Yet
          </p>
        ) : (
          urls.map((url) => (
            <div
              key={url.id}
              style={{
                backgroundColor: "#334155",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Original:</strong> {url.originalUrl}
              </p>

              <p style={{ marginTop: "4px" }}>
                <strong>Short:</strong>{" "}
                <a
                  href={`${BACKEND_URL}/${url.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#60a5fa", textDecoration: "underline" }}
                >
                  {`${BACKEND_URL}/${url.shortCode}`}
                </a>
              </p>

              <p style={{ marginTop: "4px" }}>
                <strong>Clicks:</strong> {url.clickCount}
              </p>

              <button
                onClick={() => handleCopy(url.shortCode)}
                style={{
                  padding: "6px 12px",
                  marginTop: "8px",
                  cursor: "pointer",
                  backgroundColor: "#475569",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Copy Link
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;