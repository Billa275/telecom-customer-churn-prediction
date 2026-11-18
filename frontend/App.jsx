import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Activity, Users, UserMinus, UserCheck, BrainCircuit, BarChart3, Info, LayoutDashboard, 
  ChevronRight, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Smartphone, 
  Wifi, CreditCard, Zap
} from 'lucide-react';

// ==========================================
// MOCK API SERVICE (Extract to src/services/api.js)
// ==========================================
export const predictChurn = async (customerData) => {
  // Simulating network latency for the loading state
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simple mock logic to generate realistic-looking demo results
  const isHighRisk = customerData.Contract === 'Month-to-month' || customerData.tenure < 12;
  const probability = isHighRisk ? (0.6 + Math.random() * 0.35) : (0.1 + Math.random() * 0.4);
  
  let riskLevel = 'Low Risk';
  let strategy = 'Do Nothing';
  
  if (probability > 0.75) {
    riskLevel = 'High Risk';
    strategy = 'Offer Discount';
  } else if (probability > 0.45) {
    riskLevel = 'Medium Risk';
    strategy = 'Call Customer';
  }

  return {
    prediction: probability > 0.5 ? 'Yes' : 'No',
    churn_probability: probability,
    risk_level: riskLevel,
    recommended_strategy: strategy
  };
};

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function ChurnAI() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'predict' && <PredictChurn />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'about' && <About />}
      </main>
    </div>
  );
}

// ==========================================
// NAVBAR COMPONENT
// ==========================================
function Navbar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predict', label: 'Predict Churn', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <BrainCircuit className="h-8 w-8 text-indigo-600 mr-2" />
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ChurnAI</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === item.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-slate-500 hover:text-indigo-500'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              AI Active
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
function Dashboard({ setCurrentView }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-16 text-center md:py-20 md:px-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Predict Customer Churn <br className="hidden md:block"/> Before It Happens
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            AI-powered customer churn prediction and retention insights for telecom businesses. Predict risk, understand patterns, and take action.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setCurrentView('predict')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all flex items-center justify-center"
            >
              Predict Customer Churn
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center"
            >
              View Analytics
              <BarChart3 className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Dataset Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Customers" value="10,348" icon={Users} color="bg-blue-100 text-blue-700" />
          <StatCard title="Churned Customers" value="5,174" icon={UserMinus} color="bg-red-100 text-red-700" />
          <StatCard title="Retained Customers" value="5,174" icon={UserCheck} color="bg-emerald-100 text-emerald-700" />
          <StatCard title="Churn Rate (Balanced)" value="50%" icon={Activity} color="bg-purple-100 text-purple-700" />
        </div>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">How the System Works</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
            
            <StepCard number="1" title="Customer Data" desc="Input demographics, services, and account info." />
            <StepCard number="2" title="Data Preprocessing" desc="Data is cleaned, scaled, and safely encoded." />
            <StepCard number="3" title="XGBoost Prediction" desc="Machine learning model calculates exact churn risk." />
            <StepCard number="4" title="Q-Learning Strategy" desc="RL agent recommends the optimal retention action." />
          </div>
          <p className="text-center text-slate-500 mt-8 text-sm max-w-2xl mx-auto">
            Customer information is processed and passed to an XGBoost model to predict churn. The predicted risk is then used by the retention strategy component to recommend an appropriate action.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
      <div className={`p-4 rounded-lg mr-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="text-center bg-white z-10">
      <div className="w-10 h-10 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">
        {number}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 px-2">{desc}</p>
    </div>
  );
}

// ==========================================
// PREDICT CHURN COMPONENT
// ==========================================
function PredictChurn() {
  const initialFormState = {
    gender: 'Male', SeniorCitizen: '0', Partner: 'No', Dependents: 'No', tenure: '',
    PhoneService: 'Yes', MultipleLines: 'No', InternetService: 'Fiber optic',
    OnlineSecurity: 'No', OnlineBackup: 'No', DeviceProtection: 'No', TechSupport: 'No',
    StreamingTV: 'No', StreamingMovies: 'No', Contract: 'Month-to-month',
    PaperlessBilling: 'Yes', PaymentMethod: 'Electronic check', MonthlyCharges: '', TotalCharges: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await predictChurn(formData);
      setResult(response);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setResult(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Predict Customer Churn</h1>
        <p className="text-slate-500">Enter customer details below to run the XGBoost prediction and get Q-Learning retention recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: PROFILE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4 text-indigo-600">
                <Users className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">1. Customer Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female']} />
                <SelectGroup label="Senior Citizen" name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleInputChange} options={[{val: '1', label: 'Yes'}, {val: '0', label: 'No'}]} />
                <SelectGroup label="Partner" name="Partner" value={formData.Partner} onChange={handleInputChange} options={['Yes', 'No']} />
                <SelectGroup label="Dependents" name="Dependents" value={formData.Dependents} onChange={handleInputChange} options={['Yes', 'No']} />
                <InputGroup label="Tenure (months)" name="tenure" type="number" step="1" min="0" value={formData.tenure} onChange={handleInputChange} required />
              </div>
            </div>

            {/* SECTION 2: SERVICES */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4 text-indigo-600">
                <Wifi className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">2. Subscribed Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectGroup label="Phone Service" name="PhoneService" value={formData.PhoneService} onChange={handleInputChange} options={['Yes', 'No']} />
                <SelectGroup label="Multiple Lines" name="MultipleLines" value={formData.MultipleLines} onChange={handleInputChange} options={['Yes', 'No', 'No phone service']} />
                <SelectGroup label="Internet Service" name="InternetService" value={formData.InternetService} onChange={handleInputChange} options={['DSL', 'Fiber optic', 'No']} />
                <SelectGroup label="Online Security" name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
                <SelectGroup label="Online Backup" name="OnlineBackup" value={formData.OnlineBackup} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
                <SelectGroup label="Device Protection" name="DeviceProtection" value={formData.DeviceProtection} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
                <SelectGroup label="Tech Support" name="TechSupport" value={formData.TechSupport} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
                <SelectGroup label="Streaming TV" name="StreamingTV" value={formData.StreamingTV} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
                <SelectGroup label="Streaming Movies" name="StreamingMovies" value={formData.StreamingMovies} onChange={handleInputChange} options={['Yes', 'No', 'No internet service']} />
              </div>
            </div>

            {/* SECTION 3: ACCOUNT INFO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4 text-indigo-600">
                <CreditCard className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">3. Account Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="Contract" name="Contract" value={formData.Contract} onChange={handleInputChange} options={['Month-to-month', 'One year', 'Two year']} />
                <SelectGroup label="Paperless Billing" name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleInputChange} options={['Yes', 'No']} />
                <SelectGroup label="Payment Method" name="PaymentMethod" value={formData.PaymentMethod} onChange={handleInputChange} options={['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)']} />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Monthly Charges ($)" name="MonthlyCharges" type="number" step="0.01" min="0" value={formData.MonthlyCharges} onChange={handleInputChange} required />
                  <InputGroup label="Total Charges ($)" name="TotalCharges" type="number" step="0.01" min="0" value={formData.TotalCharges} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center disabled:opacity-70"
              >
                {isLoading ? (
                  <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Analyzing customer profile...</>
                ) : (
                  <><Zap className="w-5 h-5 mr-2" /> Predict Churn</>
                )}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-xl font-medium transition-all"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {result ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6">
                <div className={`p-6 text-center ${result.prediction === 'Yes' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">Customer Prediction</h3>
                  
                  {result.prediction === 'Yes' ? (
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="w-16 h-16 text-red-500 mb-2" />
                      <h2 className="text-2xl font-black text-red-700">Likely to Churn</h2>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-2" />
                      <h2 className="text-2xl font-black text-emerald-700">Likely to Stay</h2>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-end">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Probability</p>
                      <p className="text-3xl font-bold text-slate-800">{(result.churn_probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Risk Level</p>
                      <span className={`inline-block px-3 py-1 mt-1 rounded-md text-xs font-bold ${
                        result.risk_level === 'High Risk' ? 'bg-red-200 text-red-800' :
                        result.risk_level === 'Medium Risk' ? 'bg-amber-200 text-amber-800' :
                        'bg-emerald-200 text-emerald-800'
                      }`}>
                        {result.risk_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-800 text-white">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center">
                    <BrainCircuit className="w-4 h-4 mr-2" /> Q-Learning Recommendation
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-300 mb-1">Recommended Strategy:</p>
                    <p className="text-2xl font-bold text-indigo-400">{result.recommended_strategy}</p>
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Based on the predicted churn risk, this customer may benefit from a targeted retention offer evaluated by the RL agent.
                  </p>
                </div>
              </div>

              {/* Insights Summary Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 border-b pb-2">Customer Profile Snapshot</h3>
                <ul className="space-y-3 text-sm">
                  <SnapshotRow label="Tenure" value={`${formData.tenure} months`} />
                  <SnapshotRow label="Contract" value={formData.Contract} />
                  <SnapshotRow label="Internet" value={formData.InternetService} />
                  <SnapshotRow label="Monthly Bill" value={`$${formData.MonthlyCharges}`} />
                  <SnapshotRow label="Total Value" value={`$${formData.TotalCharges}`} />
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium">Submit the form to generate AI predictions and retention strategies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">{label}</label>
      <select 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm transition-colors"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.val !== undefined ? opt.val : opt}>
            {opt.label !== undefined ? opt.label : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputGroup({ label, name, type, step, min, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">{label}</label>
      <input 
        type={type} 
        name={name} 
        step={step}
        min={min}
        value={value} 
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm transition-colors"
      />
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <li className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </li>
  );
}

// ==========================================
// ANALYTICS COMPONENT
// ==========================================
function Analytics() {
  // Demo data matching the balanced dataset context
  const churnData = [
    { name: 'Churn (Yes)', value: 5174, color: '#ef4444' },
    { name: 'Retained (No)', value: 5174, color: '#10b981' }
  ];

  const riskData = [
    { name: 'Low Risk', count: 4200 },
    { name: 'Medium Risk', count: 2848 },
    { name: 'High Risk', count: 3300 }
  ];

  const contractData = [
    { name: 'Month-to-month', Churned: 3800, Retained: 1400 },
    { name: 'One year', Churned: 800, Retained: 1600 },
    { name: 'Two year', Churned: 574, Retained: 2174 }
  ];

  const internetData = [
    { name: 'Fiber optic', Churned: 3500, Retained: 1200 },
    { name: 'DSL', Churned: 1200, Retained: 2500 },
    { name: 'No Internet', Churned: 474, Retained: 1474 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dataset Analytics</h1>
        <p className="text-slate-500">Exploratory data analysis on the balanced Telco Churn dataset.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Churn Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-6">Churn Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={churnData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-6">Predicted Risk Levels</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn by Contract */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-6">Churn by Contract Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Legend />
                <Bar dataKey="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Retained" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn by Internet Service */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-6">Churn by Internet Service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Legend />
                <Bar dataKey="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Retained" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// ABOUT COMPONENT
// ==========================================
function About() {
  const techs = [
    'Python', 'Pandas', 'NumPy', 'Scikit-learn', 
    'XGBoost', 'Q-Learning', 'Flask', 'React', 'Tailwind CSS', 'Recharts'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center">
          <Info className="w-8 h-8 mr-3 text-indigo-600" /> About ChurnAI
        </h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
          <p>
            <strong>ChurnAI</strong> is an AI-powered customer churn prediction and retention recommendation system designed for the telecom domain. 
          </p>
          <p>
            It identifies customers who are likely to leave based on their demographic profile, subscribed services, and account information. Once the risk is determined, the Reinforcement Learning component provides risk-based retention recommendations to help the business take optimal actions.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-sm font-bold text-slate-700 uppercase mb-6 tracking-widest">Core Technologies</h2>
        <div className="flex flex-wrap gap-3">
          {techs.map((tech, i) => (
            <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium shadow-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}