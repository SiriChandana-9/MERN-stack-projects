import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // We'll add some custom styles

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", course: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing student
        await axios.put(`http://localhost:5000/students/${editingId}`, form);
        setEditingId(null);
      } else {
        // Add new student
        await axios.post("http://localhost:5000/students", form);
      }
      setForm({ name: "", email: "", course: "", age: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      age: student.age,
    });
    setEditingId(student._id);
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <h1>Student Management System</h1>

      {/* Form */}
      <form className="student-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
      </form>

      {/* Student List */}
      <div className="student-list">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <h3>{student.name}</h3>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Age:</strong> {student.age}</p>
            <div className="actions">
              <button onClick={() => handleEdit(student)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
