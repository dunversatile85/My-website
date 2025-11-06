"use client";

import React from "react";

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#0a0a0a",
        color: "#e0e0e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <iframe
        src="https://dpw7.it.com"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "#1a1a1a",
        }}
        title="Don's Playworld"
      ></iframe>
    </main>
  );
}

