import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CreditCard, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Download,
  ArrowRight,
  Loader2
} from 'lucide-react';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Fetch customer details using the new /me endpoint
      const myProfileRes = await axios.get('http://localhost:5000/api/customers/me', config);
      const myProfile = myProfileRes.data;
      
      if (myProfile) {
        setCustomer(myProfile);
        const paymentsRes = await axios.get(`http://localhost:5000/api/payments/customer/${myProfile.id}`, config);
        setPayments(paymentsRes.data);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    setPaying(true);
    
    const options = {
      key: "rzp_test_dummy_key_replace_me", // Replace with actual Razorpay Key
      amount: customer.monthlyAmount * 100, // Amount in paise
      currency: "INR",
      name: "CableFlow Services",
      description: "Monthly Cable Subscription",
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          
          await axios.post('http://localhost:5000/api/payments', {
            customerId: customer.id,
            amount: customer.monthlyAmount,
            method: 'ONLINE',
            transactionId: response.razorpay_payment_id || 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
          }, config);
          
          alert('Successfully Paid! Your account has been updated.');
          fetchData();
        } catch (error) {
          console.error(error);
          alert('Payment was successful, but recording it failed. Please contact support.');
        } finally {
          setPaying(false);
        }
      },
      prefill: {
        name: customer.name,
        email: customer.email || "",
        contact: customer.phone || ""
      },
      theme: {
        color: "#2563eb"
      },
      modal: {
        ondismiss: function() {
          setPaying(false);
        }
      }
    };
    
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!customer) return (
    <div className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">No Connection Linked</h2>
      <p className="text-slate-500 mt-2">Your account is not linked to any cable connection yet. Please contact support.</p>
      {error && <p className="text-red-500 mt-4 font-mono text-sm p-4 bg-red-50 rounded-xl">{error}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-500">
      <div className="lg:col-span-2 space-y-8">
        {/* Billing Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-10">
              <div>
                <h2 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Current Billing Cycle</h2>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Monthly Subscription</h3>
              </div>
              <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold ${
                customer.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {customer.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Cable ID</p>
                <p className="font-bold text-slate-800 mt-1">{customer.cableId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Due Date</p>
                <p className="font-bold text-slate-800 mt-1">{new Date(customer.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium uppercase">Service Address</p>
                <p className="font-medium text-slate-800 mt-1 truncate">{customer.address || 'Registered Address'}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Outstanding</p>
                <p className="text-3xl font-black text-slate-900 mt-1">₹{customer.status === 'PAID' ? '0.00' : customer.monthlyAmount.toLocaleString()}</p>
              </div>
              {customer.status === 'UNPAID' && (
                <button 
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {paying ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Payment History</h2>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">No payment history found</td>
                  </tr>
                ) : payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{p.transactionId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{p.method}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{p.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-50">
            {payments.length === 0 ? (
              <div className="p-6 text-center text-slate-400">No payment history found</div>
            ) : payments.map((p) => (
              <div key={p.id} className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-800">₹{p.amount}</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{new Date(p.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase mb-0.5">Transaction ID</span>
                    <span className="text-xs font-mono text-slate-600">{p.transactionId}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 font-medium uppercase mb-0.5">Method</span>
                    <span className="text-xs font-bold text-slate-700">{p.method}</span>
                  </div>
                </div>
                <button className="w-full mt-2 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <Download size={16} /> Download Receipt
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Plan Details</h3>
            <p className="text-blue-100 mt-1 mb-6">Your current active subscription</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-200" />
                <span className="font-medium text-sm">Ultra HD Channels</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-200" />
                <span className="font-medium text-sm">OTT Subscriptions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-200" />
                <span className="font-medium text-sm">24/7 Support</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Upgrade Plan
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Support</h3>
          <p className="text-sm text-slate-500 mb-6">Need help with your connection? Our support team is here for you.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-lg text-blue-600">
                <History size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Quick Support</p>
                <p className="text-sm font-bold text-slate-800">+91 1800 123 456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
