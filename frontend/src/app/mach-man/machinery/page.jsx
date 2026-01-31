"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../../hoc";
import { TextArea, TextInput } from "../../components/inputs";
import { machineryAPI, isAuthenticated, getUser } from "../../../services/api";

const Machinery = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [machinery, setMachinery] = useState([]);

  const [formData, setFormData] = useState({
    machine_id: "",
    description: "",
    total_number: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchMachinery();
  }, []);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const res = await machineryAPI.getAll();
      setMachinery(res.rows || []);
    } catch (err) {
      setError("Failed to load machinery");
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
      if (!formData.machine_id) {
        setError("Machine ID is required");
        setSaving(false);
        return;
      }

      const user = getUser();
      const machineData = {
        ...formData,
        total_number: parseInt(formData.total_number) || 1,
        farmer: user?.user_id,
      };

      await machineryAPI.create(machineData);
      setSuccess("Machinery added successfully!");
      setFormData({ machine_id: "", description: "", total_number: "" });
      fetchMachinery();
    } catch (err) {
      setError(err.message || "Failed to save machinery");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this machinery?")) return;
    try {
      await machineryAPI.delete(id);
      setSuccess("Machinery deleted successfully!");
      fetchMachinery();
    } catch (err) {
      setError("Failed to delete machinery");
    }
  };

  return (
    <main className="form-container">
      <h1 className="form-heading">Machinery</h1>

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

      <div className="flex flex-col gap-5">
        <TextInput
          label="Machine ID *"
          value={formData.machine_id}
          onChange={handleInputChange("machine_id")}
          placeholder="e.g., TRACTOR-001"
        />
        <TextArea
          label="Description"
          value={formData.description}
          onChange={handleInputChange("description")}
          placeholder="Describe the machinery..."
        />
        <TextInput
          label="Total Number"
          value={formData.total_number}
          onChange={handleInputChange("total_number")}
          placeholder="1"
          type="number"
        />
      </div>

      <div className="form-btns-container mt-6">
        <button
          className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          onClick={() =>
            setFormData({ machine_id: "", description: "", total_number: "" })
          }
        >
          Clear
        </button>
        <button
          className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "+ Add Machinery"}
        </button>
      </div>

      {machinery.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Machinery ({machinery.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machinery.map((m) => (
              <div
                key={m.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {m.machine_id}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {m.description || "No description"}
                    </p>
                    <p className="text-gray-600">
                      Quantity:{" "}
                      <span className="font-semibold">{m.total_number}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
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

export default PageWraper(Machinery);
