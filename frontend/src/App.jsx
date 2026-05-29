import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "./components/PatientForm";
import PatientTable from "./components/PatientTable";
import EditModal from "./components/EditModal";

const API = "http://127.0.0.1:8000/api";

function App() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    const res = await axios.get(`${API}/patients`);
    setPatients(res.data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await axios.post(`${API}/patients`, formData);
      await fetchPatients();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this patient record?")) {
      await axios.delete(`${API}/patients/${id}`);
      fetchPatients();
    }
  };

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try {
      await axios.put(`${API}/patients/${id}`, formData);
      setEditPatient(null);
      fetchPatients();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f0f4f8", minHeight: "100vh" }}>
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">🏥 MIRA Health Platform</h1>
        <p className="text-muted">Medical Intelligence Robotic Automation</p>
      </div>
      <PatientForm onSubmit={handleCreate} loading={loading} />
      <PatientTable patients={patients} onEdit={setEditPatient} onDelete={handleDelete} />
      {editPatient && (
        <EditModal
          patient={editPatient}
          onSave={handleUpdate}
          onClose={() => setEditPatient(null)}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
