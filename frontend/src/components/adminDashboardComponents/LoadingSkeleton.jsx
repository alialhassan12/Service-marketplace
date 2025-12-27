import React from "react";

export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-6 bg-white/5 rounded" />
      ))}
    </div>
  );
}
