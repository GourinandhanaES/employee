import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SERVERURL from './services/serverUrl';


const App = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'active' });
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${SERVERURL}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addOrUpdateEmployee = async (e) => {
    e.preventDefault();
    if (editingEmployee) {
      await axios.put(`${SERVERURL}/employees/${editingEmployee.id}`, formData);
      setEditingEmployee(null);
    } else {
      await axios.post(`${SERVERURL}/employees`, formData);
    }
    setFormData({ name: '', email: '', status: 'active' });
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${SERVERURL}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  const startEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
  };

  return (
    <div className="container">
      <h1>EMPLOYEE MANAGEMENT</h1>
      <form onSubmit={addOrUpdateEmployee}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit">{editingEmployee ? 'Update Employee' : 'Add Employee'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.status}</td>
              <td>
                <button onClick={() => startEditEmployee(employee)} className="edit">Edit</button>
                <button onClick={() => deleteEmployee(employee.id)} className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
