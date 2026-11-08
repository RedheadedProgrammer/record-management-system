import React, { useEffect, useState } from 'react';
import api from '../api';

function Attendance() {
	const [records, setRecords] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [form, setForm] = useState({ employee_id: '', date: '', status: '' });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [submitError, setSubmitError] = useState('');

	useEffect(() => {
		api.get('/attendance')
			.then(res => setRecords(res.data))
			.catch(err => {
				console.error('Failed to load attendance records:', err);
				setError('Could not load attendance records. Make sure the backend server is running.');
			})
			.finally(() => setLoading(false));

		api.get('/employees')
			.then(res => setEmployees(res.data))
			.catch(err => {
				console.error('Failed to load employees for attendance form:', err);
				setSubmitError('Could not load employees. Refresh the page and try again.');
			});
	}, []);

	const handleChange = event => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleSubmit = event => {
		event.preventDefault();
		setSubmitError('');
		api.post('/attendance', form)
			.then(res => {
				setRecords(currentRecords => [...currentRecords, res.data]);
				setForm({ employee_id: '', date: '', status: '' });
			})
			.catch(err => {
				console.error('Failed to add attendance record:', err);
				const serverMessage = err.response?.data;
				setSubmitError(typeof serverMessage === 'string'
					? `Could not add attendance record: ${serverMessage}`
					: 'Could not add attendance record. Check the details and try again.');
			});
	};

	return (
		<div className="d-grid gap-4">
			<section className="card border-0 shadow-sm">
				<div className="card-body p-4">
					<div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
						<div>
							<h2 className="h4 mb-1">Attendance</h2>
							<p className="text-secondary mb-0">Review attendance and record daily status.</p>
						</div>
						<span className="badge rounded-pill text-bg-primary">{records.length} records</span>
					</div>
					{loading ? (
						<p className="text-secondary mb-0">Loading attendance records...</p>
					) : error ? (
						<div className="alert alert-danger mb-0" role="alert">{error}</div>
					) : records.length === 0 ? (
						<p className="text-secondary mb-0">No attendance records found.</p>
					) : (
						<div className="table-responsive">
							<table className="table table-hover align-middle mb-0">
								<thead className="table-light">
									<tr>
										<th scope="col">Employee ID</th>
										<th scope="col">Date</th>
										<th scope="col">Status</th>
									</tr>
								</thead>
								<tbody>
									{records.map(record => (
										<tr key={record.attendance_id}>
											<td className="fw-semibold">{record.employee_id}</td>
											<td>{String(record.date).slice(0, 10)}</td>
											<td><span className="badge text-bg-light border">{record.status}</span></td>
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
					<h3 className="h5 mb-3">Add Attendance Record</h3>
					<form className="row g-3" onSubmit={handleSubmit}>
						<div className="col-md-4">
							<label className="form-label" htmlFor="attendance-employee-id">Employee ID</label>
							<select
								name="employee_id"
								className="form-select"
								id="attendance-employee-id"
								value={form.employee_id}
								onChange={handleChange}
								required
							>
								<option value="" disabled>Select an employee</option>
								{employees.map(employee => (
									<option key={employee.employee_id} value={employee.employee_id}>
										{employee.first_name} {employee.last_name} (ID: {employee.employee_id})
									</option>
								))}
							</select>
							{employees.length === 0 && !submitError && (
								<div className="form-text">No employees available. Add an employee first.</div>
							)}
						</div>
						<div className="col-md-4">
							<label className="form-label" htmlFor="attendance-date">Date</label>
							<input
					name="date"
					type="date"
					className="form-control"
					id="attendance-date"
					value={form.date}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-md-4">
							<label className="form-label" htmlFor="attendance-status">Status</label>
							<input
					name="status"
					className="form-control"
					id="attendance-status"
					placeholder="Status (e.g. Present)"
					value={form.status}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-12">
							<button className="btn btn-primary" type="submit">Add Attendance</button>
						</div>
					</form>
					{submitError && <div className="alert alert-danger mt-3 mb-0" role="alert">{submitError}</div>}
				</div>
			</section>
		</div>
	);
}

export default Attendance;
