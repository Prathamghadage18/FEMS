"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../../hoc";
import { SelectInput, TextInput } from "../../components/inputs";
import { manpowerAPI, isAuthenticated, getUser } from "../../../services/api";

const ManPower = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [workers, setWorkers] = useState([]);

  const [formData, setFormData] = useState({
    person_id: "",
    name: "",
    phone: "",
    position: "",
    description: "",
  });

  const positionOptions = [
    "Worker",
    "Manager",
    "Supervisor",
    "Driver",
    "Helper",
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await manpowerAPI.getAll();
      setWorkers(res.rows || []);
    } catch (err) {
      setError("Failed to load manpower data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (!formData.name) {
        setError("Name is required");
        setSaving(false);
        return;
      }

      const user = getUser();
      const workerData = {
        ...formData,
        farmer: user?.user_id,
      };

      await manpowerAPI.create(workerData);
      setSuccess("Worker added successfully!");
      setFormData({
        person_id: "",
        name: "",
        phone: "",
        position: "",
        description: "",
      });
      fetchWorkers();
    } catch (err) {
      setError(err.message || "Failed to save worker");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this worker?")) return;
    try {
      await manpowerAPI.delete(id);
      setSuccess("Worker deleted successfully!");
      fetchWorkers();
    } catch (err) {
      setError("Failed to delete worker");
    }
  };

  return (
    <main className="form-container">
      <h1 className="form-heading">Manpower Management</h1>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {success}
        </div>
      )}

      <div className="form-grid">
        <TextInput
          label="Person ID"
          value={formData.person_id}
          onChange={handleInputChange("person_id")}
          placeholder="e.g., EMP001"
        />
        <TextInput
          label="Name *"
          value={formData.name}
          onChange={handleInputChange("name")}
          placeholder="Full name"
        />
        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChange={handleInputChange("phone")}
          placeholder="e.g., 9876543210"
          type="tel"
        />
        <SelectInput
          label="Position"
          options={positionOptions}
          onChange={handleInputChange("position")}
        />
        <TextInput
          label="Description"
          value={formData.description}
          onChange={handleInputChange("description")}
          placeholder="Additional details"
        />
      </div>

      <div className="form-btns-container mt-6">
        <button
          className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          onClick={() =>
            setFormData({
              person_id: "",
              name: "",
              phone: "",
              position: "",
              description: "",
            })
          }
        >
          Clear
        </button>
        <button
          className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "+ Add Worker"}
        </button>
      </div>

      {workers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Workers ({workers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((w) => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {w.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      ID:{" "}
                      <span className="font-semibold">
                        {w.person_id || "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Position:{" "}
                      <span className="font-semibold">
                        {w.position || "N/A"}
                      </span>
                    </p>
                    {w.phone && (
                      <p className="text-gray-600">
                        Phone: <span className="font-semibold">{w.phone}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default PageWraper(ManPower);
