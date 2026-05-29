import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";

export default function EditModal({ patient, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    full_name: patient.full_name,
    date_of_birth: patient.date_of_birth,
    email: patient.email,
    glucose: patient.glucose,
    haemoglobin: patient.haemoglobin,
    cholesterol: patient.cholesterol,
  });

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    onSave(patient.id, {
      ...form,
      glucose: parseFloat(form.glucose),
      haemoglobin: parseFloat(form.haemoglobin),
      cholesterol: parseFloat(form.cholesterol),
    });
  };

  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>✏️ Edit Patient — {patient.full_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          {[["full_name","Full Name","text"],["date_of_birth","Date of Birth","date"],
            ["email","Email","email"],["glucose","Glucose (mg/dL)","number"],
            ["haemoglobin","Haemoglobin (g/dL)","number"],["cholesterol","Cholesterol (mg/dL)","number"]
          ].map(([name, label, type]) => (
            <Col md={6} key={name}>
              <Form.Label>{label}</Form.Label>
              <Form.Control type={type} name={name} value={form[name]} onChange={change} />
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <><Spinner size="sm" /> Updating...</> : "Save & Regenerate Remarks"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}