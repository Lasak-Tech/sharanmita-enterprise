import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import * as XLSX from 'xlsx';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpRight,
  Download,
  Eye,
  EyeOff,
  Key,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalCustomers: 0, paidCustomers: 0, unpaidCustomers: 0, revenue: 0 });
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewType, setViewType] = useState('CUSTOMERS'); // CUSTOMERS, EMPLOYEES, ADMINS
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', cableId: '', monthlyAmount: '', dueDate: '', password: '' });
  const [employeeForm, setEmployeeForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [changePasswordForm, setChangePasswordForm] = useState({ email: '', newPassword: '' });

  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [showPwd3, setShowPwd3] = useState(false);
  const [showPwd4, setShowPwd4] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchData();
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [statsRes, customersRes, usersRes] = await Promise.all([
        api.get('/api/customers/stats', config),
        api.get('/api/customers', config),
        api.get('/api/auth/users', config)
      ]);
      
      setStats(statsRes.data);
      setCustomers(customersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let data = [];
    if (viewType === 'CUSTOMERS') {
      data = customers;
    } else if (viewType === 'EMPLOYEES') {
      data = users.filter(u => u.role === 'EMPLOYEE');
    } else if (viewType === 'ADMINS') {
      data = users.filter(u => u.role === 'ADMIN');
    }

    return data.filter(item => 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.cableId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/api/customers', customerForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShowCustomerModal(false);
      setCustomerForm({ name: '', phone: '', email: '', cableId: '', monthlyAmount: '', dueDate: '', password: '' });
      fetchData();
      alert('Customer added successfully!');
    } catch (err) {
      alert('Failed to add customer');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { 
        ...employeeForm, 
        name: 'Employee', 
        phone: 'N/A',
        role: 'EMPLOYEE' 
      });
      setShowEmployeeModal(false);
      setEmployeeForm({ email: '', password: '' });
      alert('Employee added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { 
        ...adminForm, 
        name: 'Administrator', 
        phone: 'N/A',
        role: 'ADMIN' 
      });
      setShowAdminModal(false);
      setAdminForm({ email: '', password: '' });
      alert('New Admin added successfully!');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('exists')) {
        if (window.confirm('A user with this email already exists. Do you want to promote them to ADMIN?')) {
          try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.patch('/api/auth/update-role', 
              { email: adminForm.email, role: 'ADMIN' },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert('Existing user promoted to ADMIN successfully!');
            setShowAdminModal(false);
            setAdminForm({ email: '', password: '' });
          } catch (updateErr) {
            alert('Failed to update user role');
          }
        }
      } else {
        alert(err.response?.data?.message || 'Failed to add admin');
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.patch('/api/auth/change-password', changePasswordForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Password updated for ' + changePasswordForm.email);
      setShowChangePasswordModal(false);
      setChangePasswordForm({ email: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteCustomer = async (id) => {
    const isCustomer = viewType === 'CUSTOMERS';
    if (!window.confirm(`Are you sure you want to delete this ${isCustomer ? 'customer' : 'account'}?`)) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (isCustomer) {
        await api.delete(`/api/customers/${id}`, config);
      } else {
        await api.delete(`/api/auth/users/${id}`, config);
      }
      
      fetchData();
      setActiveMenuId(null);
    } catch (err) {
      alert('Failed to delete ' + (isCustomer ? 'customer' : 'account'));
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.patch(`/api/customers/${id}/status`, { status: newStatus }, config);
      setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      // Update stats locally
      setStats(prev => ({
        ...prev,
        paidCustomers: newStatus === 'PAID' ? prev.paidCustomers + 1 : (prev.paidCustomers > 0 ? prev.paidCustomers - 1 : 0),
        unpaidCustomers: newStatus === 'UNPAID' ? prev.unpaidCustomers + 1 : (prev.unpaidCustomers > 0 ? prev.unpaidCustomers - 1 : 0)
      }));
      setActiveMenuId(null);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(item => {
      if (viewType === 'CUSTOMERS') {
        return {
          'Name': item.name,
          'Account No': item.customerExternalId,
          'Serial Number': item.cableId,
          'VC Number': item.vcNumber,
          'Phone': item.phone,
          'Monthly Amount': item.monthlyAmount,
          'Status': item.status,
          'Due Date': new Date(item.dueDate).toLocaleDateString(),
          'Address': item.address,
          'LCO ID': item.lcoCustomerId
        };
      } else {
        return {
          'Name': item.name || 'N/A',
          'Email': item.email,
          'Phone': item.phone || 'N/A',
          'Role': item.role,
          'Created At': new Date(item.createdAt).toLocaleDateString()
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, viewType);
    
    // Generate filename based on date and view type
    const date = new Date().toISOString().split('T')[0];
    const filename = `CableFlow_${viewType.toLowerCase()}_${date}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Business Overview</h1>
          <p className="text-slate-500 mt-1">Real-time statistics and customer management</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowChangePasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Key size={18} />
            Change Password
          </button>
          <button 
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <ShieldCheck size={18} />
            Add Admin
          </button>
          <button 
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Add Employee
          </button>
          <button 
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={stats.totalCustomers} 
          trend="+12%" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Paid Customers" 
          value={stats.paidCustomers} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Unpaid Customers" 
          value={stats.unpaidCustomers} 
          color="bg-amber-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Monthly Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          trend="+8%" 
          color="bg-violet-500" 
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {['CUSTOMERS', 'EMPLOYEES', 'ADMINS'].map(type => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
                  viewType === type 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pb-4 md:pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleExport}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Export to Excel"
            >
              <Download size={18} />
            </button>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {viewType === 'CUSTOMERS' ? 'Customer' : 'User'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {viewType === 'CUSTOMERS' ? 'Cable ID' : 'Email'}
                </th>
                {viewType === 'CUSTOMERS' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                  </>
                )}
                {viewType !== 'CUSTOMERS' && (
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">Loading data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">No records found</td>
                </tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                        {(item.name || item.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{item.phone || item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {viewType === 'CUSTOMERS' ? item.cableId : item.email}
                  </td>
                  
                  {viewType === 'CUSTOMERS' && (
                    <>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{item.monthlyAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(item.dueDate).toLocaleDateString()}
                      </td>
                    </>
                  )}

                  {viewType !== 'CUSTOMERS' && (
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  )}

                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === item.id && (
                      <div className="absolute right-6 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-100 text-left">
                        {viewType === 'CUSTOMERS' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, item.status === 'PAID' ? 'UNPAID' : 'PAID')}
                            className="w-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            {item.status === 'PAID' ? <XCircle size={16} className="text-amber-500" /> : <CheckCircle size={16} className="text-emerald-500" />}
                            Mark as {item.status === 'PAID' ? 'Unpaid' : 'Paid'}
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setChangePasswordForm({ ...changePasswordForm, email: item.email });
                            setShowChangePasswordModal(true);
                          }}
                          className="w-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Key size={16} className="text-slate-400" />
                          Reset Password
                        </button>
                        <div className="h-px bg-slate-50 my-1"></div>
                        <button 
                          onClick={() => handleDeleteCustomer(item.id)}
                          className="w-full px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete {viewType === 'CUSTOMERS' ? 'Customer' : 'Account'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input required placeholder="Name" className="input-field" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
              <input required placeholder="Email" type="email" className="input-field" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
              <input required placeholder="Phone" className="input-field" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} />
              <input required placeholder="Cable ID" className="input-field" value={customerForm.cableId} onChange={e => setCustomerForm({...customerForm, cableId: e.target.value})} />
              <input required placeholder="Monthly Amount" type="number" className="input-field" value={customerForm.monthlyAmount} onChange={e => setCustomerForm({...customerForm, monthlyAmount: e.target.value})} />
              <input required placeholder="Due Date" type="date" className="input-field" value={customerForm.dueDate} onChange={e => setCustomerForm({...customerForm, dueDate: e.target.value})} />
              <div className="relative">
                <input required placeholder="Password (for Customer Login)" type={showPwd1 ? "text" : "password"} className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={customerForm.password} onChange={e => setCustomerForm({...customerForm, password: e.target.value})} />
                <button type="button" onClick={() => setShowPwd1(!showPwd1)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                  {showPwd1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCustomerModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Employee Account</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input required placeholder="Employee Email" type="email" className="input-field" value={employeeForm.email} onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} />
              <div className="relative">
                <input required placeholder="Password" type={showPwd2 ? "text" : "password"} className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={employeeForm.password} onChange={e => setEmployeeForm({...employeeForm, password: e.target.value})} />
                <button type="button" onClick={() => setShowPwd2(!showPwd2)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                  {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEmployeeModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Change User Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input required placeholder="User Email" type="email" className="input-field" value={changePasswordForm.email} onChange={e => setChangePasswordForm({...changePasswordForm, email: e.target.value})} />
              <div className="relative">
                <input required placeholder="New Password" type={showPwd3 ? "text" : "password"} className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={changePasswordForm.newPassword} onChange={e => setChangePasswordForm({...changePasswordForm, newPassword: e.target.value})} />
                <button type="button" onClick={() => setShowPwd3(!showPwd3)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                  {showPwd3 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowChangePasswordModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input required placeholder="Admin Email" type="email" className="input-field" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
              <div className="relative">
                <input required placeholder="Password" type={showPwd4 ? "text" : "password"} className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
                <button type="button" onClick={() => setShowPwd4(!showPwd4)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                  {showPwd4 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200">Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
