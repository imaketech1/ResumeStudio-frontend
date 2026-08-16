"use client";
//TODO: Implement a form to edit the portfolio data and save it back to localStorage or send it to the backend.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("portfolio");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) return <p>Loading...</p>;

  const handleSave = () => {
    localStorage.setItem("portfolio", JSON.stringify(data));
    router.push("/portfolio");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Portfolio</h1>

      {/* USER */}
      <input
        value={data.user.name}
        onChange={(e) =>
          setData({ ...data, user: { ...data.user, name: e.target.value } })
        }
      />

      <input
        value={data.user.email}
        onChange={(e) =>
          setData({ ...data, user: { ...data.user, email: e.target.value } })
        }
      />

      {/* ABOUT */}
      <textarea
        value={data.about}
        onChange={(e) =>
          setData({ ...data, about: e.target.value })
        }
      />

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save & View Portfolio
      </button>
    </div>
  );
}