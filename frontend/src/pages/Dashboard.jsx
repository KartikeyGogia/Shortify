import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [urls, setUrls] = useState([]);

  const navigate = useNavigate();

  const fetchMyUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/url/my-urls",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUrls(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyUrls();
  }, []);

  const handleCreateUrl = async () => {
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

      alert("Failed to create URL");
    }
  };

 const handleCopy = () => {
  const shortUrl =
    window.location.hostname === "localhost"
      ? `http://localhost:5000/${shortCode}`
      : `${window.location.origin}/${shortCode}`;

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
          marginBottom: "20px",
        }}
      >
        <h1>Shortify Dashboard</h1>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            cursor: "pointer",
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

        <input
          type="text"
          placeholder="Paste URL"
          value={originalUrl}
          onChange={(e) =>
            setOriginalUrl(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
          }}
        />

        <button
          onClick={handleCreateUrl}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            cursor: "pointer",
          }}
        >
          Create Short URL
        </button>

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

            <p>
  {window.location.hostname === "localhost"
    ? `http://localhost:5000/${shortCode}`
    : `${window.location.origin}/${shortCode}`}
</p>

            <button
              onClick={handleCopy}
              style={{
                padding: "10px",
                marginTop: "10px",
                cursor: "pointer",
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
          <p>No URLs Created Yet</p>
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
                <strong>Original:</strong>{" "}
                {url.originalUrl}
              </p>

              <p>
                <strong>Short:</strong>{" "}
                {window.location.hostname === "localhost"
  ? `http://localhost:5000/${url.shortCode}`
  : `${window.location.origin}/${url.shortCode}`}
              </p>

              <p>
                <strong>Clicks:</strong>{" "}
                {url.clickCount}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;