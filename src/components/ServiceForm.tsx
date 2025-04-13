"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import DropdownMenu from "@/components/ui/DropdownMenu"; // Import DropdownMenu

const statusOptions = [
  { value: "OPERATIONAL", label: "Operational" },
  { value: "DEGRADED", label: "Degraded Performance" },
  { value: "PARTIAL_OUTAGE", label: "Partial Outage" },
  { value: "MAJOR_OUTAGE", label: "Major Outage" },
];

export default function ServiceForm({ service = null, onSave }: any) {
  const [name, setName] = useState(service?.name || "");
  const [status, setStatus] = useState(service?.status || "OPERATIONAL");

  // Update form fields when the service prop changes (for editing)
  useEffect(() => {
    if (service) {
      setName(service.name);
      setStatus(service.status);
    }
  }, [service]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = { name, status };

    try {
      if (service?.id) {
        // Use PATCH for updating an existing service
        await axios.patch(`/services/${service.id}/`, payload);
        console.log("Service updated successfully");
      } else {
        // Use POST for creating a new service
        await axios.post("/services/", payload);
        console.log("Service created successfully");
      }

      onSave(); // Refresh parent list after save
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/services/${service.id}/`);
      onSave(); // Refresh parent list after deletion
      console.log("Service deleted successfully");
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">{service?.id ? "Update" : "Create"} Service</Button>

      {/* Dropdown for additional actions like rename and delete */}
      {service?.id && (
        <DropdownMenu
          options={[
            { label: "Rename Service", value: "rename" },
            { label: "Delete Service", value: "delete" },
          ]}
          onSelect={(option) => {
            if (option.value === "delete") {
              handleDelete();
            } else if (option.value === "rename") {
              // Handle renaming here if necessary
              console.log("Rename Service clicked");
            }
          }}
        />
      )}
    </form>
  );
}
