import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";

const initialState = {
full_name: "",
date_of_birth: "",
email: "",
glucose: "",
haemoglobin: "",
cholesterol: "",
};

export default function PatientForm({ onSubmit, loading }) {
const [form, setForm] = useState(initialState);
const [errors, setErrors] = useState({});

const validate = () => {
const e = {};


if (!form.full_name.trim()) {
  e.full_name = "Name is required";
}

if (!form.date_of_birth) {
  e.date_of_birth = "Date of birth is required";
} else if (new Date(form.date_of_birth) > new Date()) {
  e.date_of_birth = "Cannot be future date";
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
  e.email = "Invalid email address";
}

["glucose", "haemoglobin", "cholesterol"].forEach((field) => {
  if (!form[field] || isNaN(form[field]) || Number(form[field]) <= 0) {
    e[field] = "Must be a positive number";
  }
});

return e;

};

const handleSubmit = async (e) => {
e.preventDefault();


const validationErrors = validate();

if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  return;
}

await onSubmit({
  ...form,
  glucose: parseFloat(form.glucose),
  haemoglobin: parseFloat(form.haemoglobin),
  cholesterol: parseFloat(form.cholesterol),
});

setForm(initialState);
setErrors({});


};

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

return ( <Card className="mb-4 shadow-sm">
<Card.Header className="bg-primary text-white fw-semibold">
➕ Add New Patient
</Card.Header>


  <Card.Body>
    <Form onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={4}>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            isInvalid={!!errors.full_name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.full_name}
          </Form.Control.Feedback>
        </Col>

        <Col md={4}>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            isInvalid={!!errors.date_of_birth}
          />
          <Form.Control.Feedback type="invalid">
            {errors.date_of_birth}
          </Form.Control.Feedback>
        </Col>

        <Col md={4}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Col>

        <Col md={4}>
          <Form.Label>Glucose (mg/dL)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="glucose"
            value={form.glucose}
            onChange={handleChange}
            isInvalid={!!errors.glucose}
          />
          <Form.Control.Feedback type="invalid">
            {errors.glucose}
          </Form.Control.Feedback>
        </Col>

        <Col md={4}>
          <Form.Label>Haemoglobin (g/dL)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="haemoglobin"
            value={form.haemoglobin}
            onChange={handleChange}
            isInvalid={!!errors.haemoglobin}
          />
          <Form.Control.Feedback type="invalid">
            {errors.haemoglobin}
          </Form.Control.Feedback>
        </Col>

        <Col md={4}>
          <Form.Label>Cholesterol (mg/dL)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="cholesterol"
            value={form.cholesterol}
            onChange={handleChange}
            isInvalid={!!errors.cholesterol}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cholesterol}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Button type="submit" className="mt-3" disabled={loading}>
        {loading ? (
          <>
            <Spinner
              animation="border"
              size="sm"
              className="me-2"
            />
            Generating AI Remarks...
          </>
        ) : (
          "Add Patient & Generate Remarks"
        )}
      </Button>
    </Form>
  </Card.Body>
</Card>


);
}
