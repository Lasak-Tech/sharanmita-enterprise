import React, { useState } from 'react';
import api from '../utils/api';
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download,
  Info
} from 'lucide-react';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}` 
        } 
      };
      
      const { data } = await api.post('/api/customers/upload', formData, config);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed. Please check the file format.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Bulk Import Customers</h1>
        <p className="text-slate-500 mt-1">Upload an Excel file to import or update customer records</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
          <FileUp size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {file ? file.name : 'Select Excel File'}
        </h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Supported formats: .xlsx, .xls, .csv. Ensure your file follows the standard template.
        </p>
        
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <label 
            htmlFor="file-upload" 
            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors"
          >
            Choose File
          </label>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <FileUp size={20} />}
            Upload Now
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Import Successful</h4>
            <p className="text-emerald-700 text-sm mt-1">{result.message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-rose-900">Import Failed</h4>
            <p className="text-rose-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Info className="text-blue-600" size={24} />
          <h3 className="text-lg font-bold text-blue-900">Expected File Format</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            'S.No', 'Account No', 'LCO Customer ID', 
            'Serial Number', 'VC Number', 'Name', 
            'Address', 'Created Date', 'Mobile No',
            'Package(s)', 'Status', 'Monthly Amount'
          ].map(field => (
            <div key={field} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">{field}</span>
            </div>
          ))}
        </div>
        <a 
          href="/sample_template.csv" 
          download="cableflow_sample_template.csv"
          className="mt-8 inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline"
        >
          <Download size={18} />
          Download Sample Template
        </a>
      </div>
    </div>
  );
};

export default AdminUpload;
