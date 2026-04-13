"use client";

import { useState } from "react";

export default function SubmitRating({ gameID }: { gameID?: string }) {
  const actualGameID = gameID || "123"; // ✅ FORCE VALUE

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    console.log("Sending:", rating, actualGameID); // ✅ FIXED

    await fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, gameID: actualGameID }), // ✅ FIXED
    });

    setOpen(false);
    alert("Rating submitted!");
  };

  return (
    <>
      {/* Button to open modal */}
      <button onClick={() => setOpen(true)}>
        Rate Game
      </button>

      {/* Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              margin: "100px auto",
              width: "300px",
            }}
          >
            <h2>Rate this Game (1-10)</h2>

            <input
              type="number"
              min="1"
              max="10"
              value={rating || ""}
              onChange={(e) => setRating(Number(e.target.value))}
            />

            <br />
            <br />

            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}