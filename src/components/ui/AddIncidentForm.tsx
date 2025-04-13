"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import socket from "@/lib/socket";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AddIncidentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch services only if the user is authenticated
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/services/");
      setServices(response.data);
      setFetchError(null);
    } catch (error: any) {
      console.error("Failed to fetch services:", error);
      setFetchError(
        error.response?.data?.detail || "Error fetching services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchServices();
      } else {
        setLoading(false);
        setFetchError("You must be logged in to fetch services.");
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/incidents/", {
        title,
        description,
        is_resolved: false,
        service,
      });

      // Emit socket event after successful creation
      socket.emit("new-incident", response.data);

      setTitle("");
      setDescription("");
      setService("");
      console.log("Incident created:", response.data);
    } catch (err) {
      console.error("Failed to create incident:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="space-y-1">
        <label htmlFor="service" className="text-sm font-medium text-gray-700">
          Select Service
        </label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading services...</p>
        ) : fetchError ? (
          <p className="text-sm text-red-500">{fetchError}</p>
        ) : (
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <Button type="submit" disabled={loading || fetchError !== null}>
        Create Incident
      </Button>
    </form>
  );
}
