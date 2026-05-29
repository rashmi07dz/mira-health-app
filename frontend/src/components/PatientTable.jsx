import React from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";

export default function PatientTable({ patients, onEdit, onDelete }) {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white fw-semibold">📋 Patient Records ({patients.length})</Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>Name</th><th>DOB</th><th>Email</th>
              <th>Glucose</th><th>Haemoglobin</th><th>Cholesterol</th>
              <th>AI Remarks</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan="8" className="text-center text-muted py-4">No records yet. Add a patient above.</td></tr>
            ) : patients.map(p => (
              <tr key={p.id}>
                <td className="fw-semibold">{p.full_name}</td>
                <td>{p.date_of_birth}</td>
                <td>{p.email}</td>
                <td><Badge bg={p.glucose > 99 ? "danger" : "success"}>{p.glucose}</Badge></td>
                <td><Badge bg={p.haemoglobin < 12 ? "danger" : "success"}>{p.haemoglobin}</Badge></td>
                <td><Badge bg={p.cholesterol > 200 ? "danger" : "success"}>{p.cholesterol}</Badge></td>
                <td style={{ maxWidth: 300, fontSize: "0.82rem" }}>{p.remarks}</td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1" onClick={() => onEdit(p)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => onDelete(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}