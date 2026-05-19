import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PAID, UNPAID
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/api/customers', config);
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    setUpdatingId(id);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.patch(`/api/customers/${id}/status`, { status: 'PAID' }, config);
      
      // Update local state
      setCustomers(customers.map(c => c.id === id ? { ...c, status: 'PAID' } : c));
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.phone.includes(searchTerm) || 
                         c.cableId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = customers.filter(c => c.status === 'UNPAID').length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Field Collections</h1>
            <p className="text-blue-100 mt-1">Manage customer payments on the go</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Pending</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone or cable ID..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0">
          {['ALL', 'UNPAID', 'PAID'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-400 font-medium">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
            No customers found matching your criteria
          </div>
        ) : filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{customer.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{customer.cableId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                customer.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {customer.status}
              </span>
            </div>

            <div className="space-y-3 flex-1 mb-6">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <MapPin size={16} />
                <span className="truncate">{customer.address || 'No address provided'}</span>
              </div>
              <div className="pt-2 flex items-baseline justify-between border-t border-slate-50">
                <span className="text-slate-500 text-xs">Monthly Bill</span>
                <span className="text-xl font-bold text-slate-800">₹{customer.monthlyAmount}</span>
              </div>
            </div>

            {customer.status === 'UNPAID' ? (
              <button
                onClick={() => handleMarkPaid(customer.id)}
                disabled={updatingId === customer.id}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                {updatingId === customer.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Mark as Paid
              </button>
            ) : (
              <div className="w-full py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Payment Collected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
