import React, { useEffect, useState } from 'react';
import api from '../api';

function Payroll() {
	const [records, setRecords] = useState([]);
	const [form, setForm] = useState({
		employee_id: '',
		base_salary: '',
		bonus: '',
		deductions: '',
		pay_date: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [submitError, setSubmitError] = useState('');

	useEffect(() => {
		api.get('/payroll')
			.then(res => setRecords(res.data))
			.catch(err => {
				console.error('Failed to load payroll records:', err);
				setError('Could not load payroll records. Make sure the backend server is running.');
			})
			.finally(() => setLoading(false));
	}, []);

	const handleChange = event => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleSubmit = event => {
		event.preventDefault();
		setSubmitError('');
		api.post('/payroll', form)
			.then(res => {
				setRecords(currentRecords => [...currentRecords, res.data]);
				setForm({ employee_id: '', base_salary: '', bonus: '', deductions: '', pay_date: '' });
			})
			.catch(err => {
				console.error('Failed to add payroll record:', err);
				setSubmitError('Could not add payroll record. Check the details and try again.');
			});
	};

	return (
		<div className="d-grid gap-4">
			<section className="card border-0 shadow-sm">
				<div className="card-body p-4">
					<div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
						<div>
							<h2 className="h4 mb-1">Payroll</h2>
							<p className="text-secondary mb-0">Review employee pay and create payroll records.</p>
						</div>
						<span className="badge rounded-pill text-bg-primary">{records.length} records</span>
					</div>
					{loading ? (
						<p className="text-secondary mb-0">Loading payroll records...</p>
					) : error ? (
						<div className="alert alert-danger mb-0" role="alert">{error}</div>
					) : records.length === 0 ? (
						<p className="text-secondary mb-0">No payroll records found.</p>
					) : (
						<div className="table-responsive">
							<table className="table table-hover align-middle mb-0">
								<thead className="table-light">
									<tr>
										<th scope="col">Employee ID</th>
										<th scope="col">Base salary</th>
										<th scope="col">Bonus</th>
										<th scope="col">Deductions</th>
										<th scope="col">Pay date</th>
									</tr>
								</thead>
								<tbody>
									{records.map(record => (
										<tr key={record.payroll_id}>
											<td className="fw-semibold">{record.employee_id}</td>
											<td>{record.base_salary}</td>
											<td>{record.bonus}</td>
											<td>{record.deductions}</td>
											<td>{String(record.pay_date).slice(0, 10)}</td>
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
					<h3 className="h5 mb-3">Add Payroll Record</h3>
					<form className="row g-3" onSubmit={handleSubmit}>
						<div className="col-md-6 col-lg-4">
							<label className="form-label" htmlFor="payroll-employee-id">Employee ID</label>
							<input
					name="employee_id"
					type="number"
					min="1"
				className="form-control"
				id="payroll-employee-id"
				placeholder="Employee ID"
					value={form.employee_id}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-md-6 col-lg-4">
							<label className="form-label" htmlFor="payroll-base-salary">Base salary</label>
							<input
					name="base_salary"
					type="number"
					min="0"
					step="0.01"
				className="form-control"
				id="payroll-base-salary"
				placeholder="Base salary"
					value={form.base_salary}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-md-6 col-lg-4">
							<label className="form-label" htmlFor="payroll-bonus">Bonus</label>
							<input
					name="bonus"
					type="number"
					min="0"
					step="0.01"
				className="form-control"
				id="payroll-bonus"
					placeholder="Bonus"
					value={form.bonus}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-md-6 col-lg-4">
							<label className="form-label" htmlFor="payroll-deductions">Deductions</label>
							<input
					name="deductions"
					type="number"
					min="0"
					step="0.01"
				className="form-control"
				id="payroll-deductions"
					placeholder="Deductions"
					value={form.deductions}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-md-6 col-lg-4">
							<label className="form-label" htmlFor="payroll-pay-date">Pay date</label>
							<input
					name="pay_date"
					type="date"
				className="form-control"
				id="payroll-pay-date"
					value={form.pay_date}
					onChange={handleChange}
					required
				/>
						</div>
						<div className="col-12">
							<button className="btn btn-primary" type="submit">Add Payroll</button>
						</div>
					</form>
					{submitError && <div className="alert alert-danger mt-3 mb-0" role="alert">{submitError}</div>}
				</div>
			</section>
		</div>
	);
}

export default Payroll;
