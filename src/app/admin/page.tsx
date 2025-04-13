"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ServiceForm from "@/components/ServiceForm";
import { Button } from "@/components/ui/button";
import AddIncidentForm from "@/components/ui/AddIncidentForm";
import AddMaintenanceForm from "@/components/ui/AddMaintenanceForm";
import EmptyState from "@/components/EmptyState";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else fetchServices();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchServices = async () => {
    try {
      const res = await axios.get("/services/");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await axios.delete(`/services/${serviceId}/`);
      fetchServices();
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <ServiceForm
        service={editing}
        onSave={() => {
          setEditing(null);
          fetchServices();
        }}
      />

      <hr />

      {services.length === 0 ? (
        <EmptyState
          message="You haven’t created any services yet."
          cta="Add a Service"
          href="/admin"
        />
      ) : (
        <>
          <h2 className="text-xl font-semibold">Existing Services</h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="border p-4 rounded-md flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.status}</div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setEditing(service)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    color="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <hr />

      <h2 className="text-xl font-semibold">Add Incident</h2>
      <AddIncidentForm />

      <hr />

      <h2 className="text-xl font-semibold">Schedule Maintenance</h2>
      <AddMaintenanceForm />
    </div>
  );
}
