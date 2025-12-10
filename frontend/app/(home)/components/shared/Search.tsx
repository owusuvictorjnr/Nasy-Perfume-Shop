import React from "react";

export default function Search() {
  return (
    <div className="flex items-center justify-center">
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 w-full rounded"
      />
    </div>
  );
}
