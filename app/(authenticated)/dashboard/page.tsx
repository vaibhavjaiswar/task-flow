"use client";

import { useToast } from "@/context/toast-context";

export default function DashboardPage() {
  const { showToast } = useToast();

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        className="primary-button"
        onClick={() => showToast({ message: "1234" })}
      >
        Show Toast
      </button>
    </div>
  );
}
