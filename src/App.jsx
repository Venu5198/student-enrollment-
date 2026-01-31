import { useEffect, useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentSearch from "./components/StudentSearch";
import "./styles/App.css";

const emptyStudent = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  course: "",
};

const PAGE_SIZE = 5;

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [searchId, setSearchId] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // table features
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- persistence ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("students");
    if (stored) setStudents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  /* ---------------- helpers ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    for (let key in form) {
      if (!form[key].trim()) return `${key} is required`;
    }
    return null;
  };

  /* ---------------- enroll ---------------- */

  const handleEnroll = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const err = validate();
    if (err) return setError(err);

    const id = form.studentId.trim();
    if (students.some((s) => s.studentId === id)) {
      return setError("Student ID already exists");
    }

    setStudents([...students, { ...form, studentId: id }]);
    setForm(emptyStudent);
    setMessage("Student enrolled successfully");
  };

  /* ---------------- search by ID ---------------- */

  const handleSearch = () => {
    setError("");
    setMessage("");

    const id = searchId.trim();
    if (!id) return setError("Please enter Student ID");

    const student = students.find((s) => s.studentId === id);
    if (!student) {
      setIsUpdateMode(false);
      return setError("Student not found");
    }

    setForm(student);
    setIsUpdateMode(true);
    setMessage("Student loaded for update");
  };

  /* ---------------- update ---------------- */

  const handleUpdate = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const err = validate();
    if (err) return setError(err);

    setStudents(
      students.map((s) =>
        s.studentId === form.studentId ? form : s
      )
    );

    setForm(emptyStudent);
    setSearchId("");
    setIsUpdateMode(false);
    setMessage("Student updated successfully");
  };

  /* ---------------- table actions ---------------- */

  const handleRowClick = (student) => {
    setForm(student);
    setSearchId(student.studentId);
    setIsUpdateMode(true);
    setError("");
    setMessage("Student loaded for update");
  };

  const handleDelete = (id) => {
    if (!globalThis.confirm("Delete this student?")) return;

    setStudents(students.filter((s) => s.studentId !== id));

    if (form.studentId === id) {
      setForm(emptyStudent);
      setIsUpdateMode(false);
      setSearchId("");
    }

    setMessage("Student deleted successfully");
    setError("");
  };

  /* ---------------- filter + pagination ---------------- */

  const filteredStudents = students.filter((s) =>
    Object.values(s).some((v) =>
      v.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ---------------- render ---------------- */

  return (
    <div className="container">
      <h2>Student Management</h2>

      <StudentSearch
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={handleSearch}
      />

      <StudentForm
        form={form}
        onChange={handleChange}
        onSubmit={isUpdateMode ? handleUpdate : handleEnroll}
        isUpdateMode={isUpdateMode}
      />

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {students.length > 0 && (
        <div className="student-table">
          <h3>Enrolled Students</h3>

          <input
            placeholder="Search students..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s) => (
                <tr
                  key={s.studentId}
                  className="clickable-row"
                  onClick={() => handleRowClick(s)}
                >
                  <td>{s.studentId}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.course}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.studentId);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
