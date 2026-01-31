export default function StudentForm({
  form,
  onChange,
  onSubmit,
  isUpdateMode,
}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        name="studentId"
        placeholder="Student ID"
        value={form.studentId}
        onChange={onChange}
        disabled={isUpdateMode}
      />

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={onChange}
      />

      <input
        name="course"
        placeholder="Course"
        value={form.course}
        onChange={onChange}
      />

      <button type="submit">
        {isUpdateMode ? "Update Student" : "Enroll Student"}
      </button>
    </form>
  );
}
