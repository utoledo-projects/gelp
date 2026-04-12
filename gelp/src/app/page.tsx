"use client";

import { useState } from "react";
import RatingModal from "@/components/RatingModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={() => setOpen(true)}>
        Open Rating Popup
      </button>

      {open && (
        <RatingModal
          gameId="123"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}