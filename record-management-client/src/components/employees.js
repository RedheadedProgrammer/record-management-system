import React, { useEffect, useState } from 'react';
import api from '../api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    department: '',
    email: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    api.get('/employees')
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error('Failed to load employees:', err);
        setError('Could not load employees. Make sure the backend server is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ first_name: '', last_name: '', department: '', email: '', phone: '' });
    setEditingId(null);
  };

  const handleEdit = employee => {
    setForm({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      department: employee.department || '',
      email: employee.email || '',
      phone: employee.phone || ''
    });
    setEditingId(employee.employee_id);
    setSubmitError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitError('');
    const request = editingId === null
      ? api.post('/employees', form)
      : api.put(`/employees/${editingId}`, form);

    request.then(res => {
        if (editingId === null) {
          setEmployees(currentEmployees => [...currentEmployees, res.data]);
        } else {
          setEmployees(currentEmployees => currentEmployees.map(employee =>
            employee.employee_id === editingId ? res.data : employee
          ));
        }
        resetForm();
      })
      .catch(err => {
        console.error('Failed to save employee:', err);
        setSubmitError('Could not save employee. Please check the form and try again.');
      });
  };

  const handleDelete = employeeId => {
    setSubmitError('');
    api.delete(`/employees/${employeeId}`)
      .then(() => {
        setEmployees(currentEmployees => currentEmployees.filter(
          employee => employee.employee_id !== employeeId
        ));
        if (editingId === employeeId) {
          resetForm();
        }
      })
      .catch(err => {
        console.error('Failed to delete employee:', err);
        setSubmitError('Could not delete employee. Please try again.');
      });
  };

  return (
    <div className="d-grid gap-4">
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h2 className="h4 mb-1">Employees</h2>
              <p className="text-secondary mb-0">Manage employee details and contact information.</p>
            </div>
            <span className="badge rounded-pill text-bg-primary">{employees.length} records</span>
          </div>
          {loading ? (
            <p className="text-secondary mb-0">Loading employees...</p>
          ) : error ? (
            <div className="alert alert-danger mb-0" role="alert">{error}</div>
          ) : employees.length === 0 ? (
            <p className="text-secondary mb-0">No employees found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Department</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.employee_id}>
                      <td className="fw-semibold">{emp.first_name} {emp.last_name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td className="text-end text-nowrap">
                        <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(emp)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(emp.employee_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="h5 mb-3">{editingId === null ? 'Add Employee' : 'Edit Employee'}</h3>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6 col-lg-4">
              <label className="form-label" htmlFor="employee-first-name">First name</label>
              <input className="form-control" id="employee-first-name" name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label" htmlFor="employee-last-name">Last name</label>
              <input className="form-control" id="employee-last-name" name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label" htmlFor="employee-department">Department</label>
              <input className="form-control" id="employee-department" name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="employee-email">Email</label>
              <input className="form-control" id="employee-email" name="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="employee-phone">Phone</label>
              <input className="form-control" id="employee-phone" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId === null ? 'Add Employee' : 'Save Changes'}</button>
        {editingId !== null && (
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>
        )}
            </div>
          </form>
          {submitError && <div className="alert alert-danger mt-3 mb-0" role="alert">{submitError}</div>}
        </div>
      </section>
    </div>
  );
}


export default Employees;
