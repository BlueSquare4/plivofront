"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WebsiteChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "up" | "down" | "error">("idle");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const checkWebsite = async () => {
    setStatus("checking");
    setResponseTime(null);

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const start = performance.now();

    try {
      const response = await fetch(fullUrl, { mode: "no-cors" });
      const end = performance.now();

      setResponseTime(Math.round(end - start));
      setStatus("up"); // Assume up if no error is thrown
    } catch (err) {
      setStatus("down");
    }
  };

  return (
    <Card className="p-4 mt-6">
      <h2 className="text-xl font-semibold mb-2">Website Checker</h2>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={checkWebsite} disabled={status === "checking"}>
          {status === "checking" ? "Checking..." : "Check"}
        </Button>
      </div>
      {status !== "idle" && (
        <div className="mt-2">
          {status === "up" ? (
            <span className="text-green-400">✅ Site is up</span>
          ) : status === "down" ? (
            <span className="text-red-400">❌ Site is down or not reachable</span>
          ) : (
            <span className="text-yellow-400">Checking...</span>
          )}
          {responseTime && <p className="text-sm text-gray-400">Response time: {responseTime}ms</p>}
        </div>
      )}
    </Card>
  );
}
