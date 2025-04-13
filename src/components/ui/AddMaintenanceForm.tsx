"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for description
import socket from "@/lib/socket";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AddMaintenanceForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch services once the user is authenticated
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/services/");
        setServices(response.data);
        setFetchError(null);
      } catch (error: any) {
        console.error("Failed to fetch services:", error);
        setFetchError(error.response?.data?.detail || "Error fetching services.");
      } finally {
        setLoading(false);
      }
    };

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
      // Convert the datetime-local string to an ISO string.
      const isoStart = new Date(scheduledStart).toISOString();
      const isoEnd = new Date(scheduledEnd).toISOString();

      // Ensure service is sent as a number if that's what the API expects.
      const serviceNumeric = parseInt(serviceId, 10);

      const response = await axios.post("/maintenances/", {
        title,
        description, // Send description in the payload
        scheduled_start: isoStart,
        scheduled_end: isoEnd,
        is_completed: isCompleted,
        service: serviceNumeric,
      });

      // Emit socket event after successful creation
      socket.emit("new-maintenance", response.data);

      // Reset the form fields
      setTitle("");
      setDescription("");
      setScheduledStart("");
      setScheduledEnd("");
      setIsCompleted(false);
      setServiceId("");
      console.log("Maintenance scheduled:", response.data);
    } catch (err: any) {
      console.error("Failed to schedule maintenance:", err.response?.data || err);
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
      <Input
        type="datetime-local"
        value={scheduledStart}
        onChange={(e) => setScheduledStart(e.target.value)}
        required
      />
      <Input
        type="datetime-local"
        value={scheduledEnd}
        onChange={(e) => setScheduledEnd(e.target.value)}
        required
      />
      <label className="block text-sm font-medium text-gray-700">
        Completed:
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="ml-2"
        />
      </label>

      <div className="space-y-1">
        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
          Select Service
        </label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading services...</p>
        ) : fetchError ? (
          <p className="text-sm text-red-500">{fetchError}</p>
        ) : (
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Service</option>
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <Button type="submit" disabled={loading || fetchError !== null}>
        Schedule Maintenance
      </Button>
    </form>
  );
}
