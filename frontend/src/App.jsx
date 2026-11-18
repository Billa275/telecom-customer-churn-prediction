import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Activity, Users, UserMinus, UserCheck, BrainCircuit, BarChart3, Info, LayoutDashboard, 
  ChevronRight, CheckCircle2, AlertTriangle, RefreshCw,
  Wifi, CreditCard, Zap
} from 'lucide-react';

// ==========================================
// API SERVICE (Flask Backend with Auto Fallback)
// ==========================================
const API_URL = 'http://localhost:5000/api/predict';

export const predictChurn = async (customerData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend server not reached. Running on local ML heuristic fallback:", err);
  }

  // Fallback demo simulation if Flask backend is not running
  await new Promise(resolve => setTimeout(resolve, 1000));
  const tenureNum = parseFloat(customerData.tenure) || 0;
  const monthlyNum = parseFloat(customerData.MonthlyCharges) || 0;
  
  let riskScore = 0.2;
  if (customerData.Contract === 'Month-to-month') riskScore += 0.35;
  if (customerData.InternetService === 'Fiber optic') riskScore += 0.15;
  if (customerData.PaymentMethod === 'Electronic check') riskScore += 0.1;
  if (tenureNum < 12) riskScore += 0.2;
  if (monthlyNum > 80) riskScore += 0.1;

  const probability = Math.min(Math.max(riskScore + (Math.random() * 0.1 - 0.05), 0.05), 0.95);
  const pred = probability >= 0.5 ? 'Yes' : 'No';

  let riskLevel = 'Low Risk';
  let strategy = 'Do Nothing';

  if (pred === 'No') {
    riskLevel = 'Low Risk';
    strategy = 'Do Nothing';
  } else if (pred === 'Yes' && tenureNum > 6) {
    riskLevel = 'Medium Risk';
    strategy = 'Offer Discount';
  } else {
    riskLevel = 'High Risk';
    strategy = 'Call Customer';
  }

  return {
    prediction: pred,
    churn_probability: probability,
    risk_level: riskLevel,
    recommended_strategy: strategy
  };
};

// ==========================================
// ROOT COMPONENT
// ==========================================
export default function App() {
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
            <span className="font-bold text-xl tracking-tight text-slate-900">ChurnAI</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === item.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-slate-500 hover:text-indigo-600'
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
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-16 text-center md:py-20 md:px-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Predict Customer Churn <br className="hidden md:block"/> Before It Happens
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            AI-powered customer churn prediction and retention insights for telecom businesses. Predict risk, understand patterns, and retain customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setCurrentView('predict')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              Predict Customer Churn
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              View Analytics
              <BarChart3 className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Dataset Overview (Balanced)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Customers" value="10,348" icon={Users} color="bg-blue-100 text-blue-700" />
          <StatCard title="Churned Customers" value="5,174" icon={UserMinus} color="bg-red-100 text-red-700" />
          <StatCard title="Retained Customers" value="5,174" icon={UserCheck} color="bg-emerald-100 text-emerald-700" />
          <StatCard title="Churn Rate" value="50.0%" icon={Activity} color="bg-purple-100 text-purple-700" />
        </div>
      </div>

      {/* System Pipeline */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">How the System Works</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <StepCard number="1" title="Customer Data" desc="Input demographics, subscribed services, and account details." />
            <StepCard number="2" title="Data Preprocessing" desc="Data is cleaned, scaled, and categorical fields safely encoded." />
            <StepCard number="3" title="XGBoost Churn Prediction" desc="The gradient-boosted trees model predicts churn probability." />
            <StepCard number="4" title="Q-Learning Retention" desc="The reinforcement learning agent prescribes optimal retention action." />
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
    gender: 'Male',
    SeniorCitizen: 0,
    Partner: 'No',
    Dependents: 'No',
    tenure: '12',
    PhoneService: 'Yes',
    MultipleLines: 'No',
    InternetService: 'Fiber optic',
    OnlineSecurity: 'No',
    OnlineBackup: 'Yes',
    DeviceProtection: 'Yes',
    TechSupport: 'No',
    StreamingTV: 'Yes',
    StreamingMovies: 'Yes',
    Contract: 'Month-to-month',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: '85.50',
    TotalCharges: '1026.00'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-calculates TotalCharges = tenure * MonthlyCharges
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { 
        ...prev, 
        [name]: name === 'SeniorCitizen' ? parseInt(value, 10) : value 
      };

      if (name === 'MonthlyCharges' || name === 'tenure') {
        const months = parseFloat(name === 'tenure' ? value : prev.tenure) || 0;
        const monthly = parseFloat(name === 'MonthlyCharges' ? value : prev.MonthlyCharges) || 0;
        updated.TotalCharges = (months * monthly).toFixed(2);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    const payload = {
      ...formData,
      tenure: parseInt(formData.tenure, 10) || 0,
      MonthlyCharges: parseFloat(formData.MonthlyCharges) || 0.0,
      TotalCharges: parseFloat(formData.TotalCharges) || 0.0
    };

    try {
      const response = await predictChurn(payload);
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Predict Churn & Prescribe Strategy</h1>
        <p className="text-slate-500">Provide customer attributes to compute churn probability and query the Q-Learning retention agent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: CUSTOMER PROFILE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4 text-indigo-600">
                <Users className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">1. Customer Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female']} />
                <SelectGroup label="Senior Citizen" name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleInputChange} options={[{val: 1, label: 'Yes'}, {val: 0, label: 'No'}]} />
                <SelectGroup label="Partner" name="Partner" value={formData.Partner} onChange={handleInputChange} options={['Yes', 'No']} />
                <SelectGroup label="Dependents" name="Dependents" value={formData.Dependents} onChange={handleInputChange} options={['Yes', 'No']} />
                <InputGroup label="Tenure (Months)" name="tenure" type="number" step="1" min="0" value={formData.tenure} onChange={handleInputChange} required />
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

            {/* SECTION 3: ACCOUNT INFORMATION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4 text-indigo-600">
                <CreditCard className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">3. Account Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup label="Contract" name="Contract" value={formData.Contract} onChange={handleInputChange} options={['Month-to-month', 'One year', 'Two year']} />
                <SelectGroup label="Paperless Billing" name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleInputChange} options={['Yes', 'No']} />
                <div className="md:col-span-2">
                  <SelectGroup label="Payment Method" name="PaymentMethod" value={formData.PaymentMethod} onChange={handleInputChange} options={['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)']} />
                </div>
                
                {/* Monthly Charges Input */}
                <InputGroup 
                  label="Monthly Charges ($)" 
                  name="MonthlyCharges" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={formData.MonthlyCharges} 
                  onChange={handleInputChange} 
                  required 
                />

                {/* Auto-Calculated Total Charges */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Total Charges ($) <span className="text-indigo-600 font-normal">(Auto: Tenure × Monthly)</span>
                  </label>
                  <input 
                    type="number" 
                    name="TotalCharges" 
                    step="0.01" 
                    min="0" 
                    value={formData.TotalCharges} 
                    readOnly 
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-sm focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all flex justify-center items-center disabled:opacity-70 cursor-pointer"
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
                className="px-6 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-xl font-medium transition-all cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results & Recommendations Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {result ? (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className={`p-6 text-center ${result.prediction === 'Yes' ? 'bg-red-50/70' : 'bg-emerald-50/70'}`}>
                  <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">Customer Prediction</h3>
                  
                  {result.prediction === 'Yes' ? (
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="w-14 h-14 text-red-500 mb-2" />
                      <h2 className="text-2xl font-bold text-red-700">Likely to Churn</h2>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-2" />
                      <h2 className="text-2xl font-bold text-emerald-700">Likely to Stay</h2>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-end border-t border-slate-200/60 pt-4">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Churn Probability</p>
                      <p className="text-2xl font-bold text-slate-800">{(result.churn_probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Risk Level</p>
                      <span className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold ${
                        result.risk_level === 'High Risk' ? 'bg-red-100 text-red-700' :
                        result.risk_level === 'Medium Risk' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {result.risk_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q-Learning Recommendation Card */}
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center">
                    <BrainCircuit className="w-4 h-4 mr-1.5 text-indigo-400" /> Recommended Retention Strategy
                  </h3>
                  <div className="text-center my-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="text-xl font-extrabold text-indigo-300">{result.recommended_strategy}</p>
                  </div>
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Based on the predicted churn risk, this customer may benefit from a targeted retention offer evaluated by the Q-Learning agent.
                  </p>
                </div>
              </div>

              {/* Customer Profile Snapshot */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b pb-2">Customer Profile Snapshot</h3>
                <ul className="space-y-2.5 text-xs">
                  <SnapshotRow label="Gender" value={formData.gender} />
                  <SnapshotRow label="Tenure" value={`${formData.tenure} months`} />
                  <SnapshotRow label="Contract" value={formData.Contract} />
                  <SnapshotRow label="Internet Service" value={formData.InternetService} />
                  <SnapshotRow label="Monthly Charges" value={`$${parseFloat(formData.MonthlyCharges || 0).toFixed(2)}`} />
                  <SnapshotRow label="Total Charges" value={`$${parseFloat(formData.TotalCharges || 0).toFixed(2)}`} />
                  <SnapshotRow label="Payment Method" value={formData.PaymentMethod} />
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Activity className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Click "Predict Churn" to run the XGBoost classifier and generate optimal retention strategies.</p>
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
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <select 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input 
        type={type} 
        name={name} 
        step={step}
        min={min}
        value={value} 
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <li className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800 text-right">{value}</span>
    </li>
  );
}

// ==========================================
// ANALYTICS COMPONENT
// ==========================================
function Analytics() {
  const churnData = [
    { name: 'Churn (Yes)', value: 5174, color: '#ef4444' },
    { name: 'Retained (No)', value: 5174, color: '#10b981' }
  ];

  const riskData = [
    { name: 'Low Risk', count: 4320 },
    { name: 'Medium Risk', count: 2840 },
    { name: 'High Risk', count: 3188 }
  ];

  const contractData = [
    { name: 'Month-to-month', Churned: 3820, Retained: 1410 },
    { name: 'One year', Churned: 810, Retained: 1620 },
    { name: 'Two year', Churned: 544, Retained: 2144 }
  ];

  const internetData = [
    { name: 'Fiber optic', Churned: 3480, Retained: 1220 },
    { name: 'DSL', Churned: 1210, Retained: 2490 },
    { name: 'No Internet', Churned: 484, Retained: 1464 }
  ];

  const tenureDistribution = [
    { bracket: '0-12m', count: 3850 },
    { bracket: '13-24m', count: 1820 },
    { bracket: '25-48m', count: 2210 },
    { bracket: '49-72m', count: 2468 }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dataset Analytics</h1>
        <p className="text-slate-500">Visualizations representing distributions from the balanced 10,348 customer records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Churn Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">1. Churn Distribution (Balanced)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={churnData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
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

        {/* 2. Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">2. Risk Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Churn by Contract */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">3. Churn by Contract Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Retained" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Churn by Internet Service */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">4. Churn by Internet Service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Retained" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Tenure Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4">5. Customer Tenure Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenureDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bracket" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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
  const techStack = [
    'Python', 'Pandas', 'NumPy', 'Scikit-learn', 
    'XGBoost', 'Q-Learning', 'Flask', 'React', 'Tailwind CSS', 'Recharts'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
          <Info className="w-8 h-8 mr-3 text-indigo-600" /> About ChurnAI
        </h1>
        <div className="text-slate-600 space-y-4 leading-relaxed">
          <p>
            <strong>ChurnAI</strong> is an AI-powered customer churn prediction and retention recommendation system designed for the telecom domain. It identifies customers who are likely to leave and provides risk-based retention recommendations.
          </p>
          <p>
            The predictive model utilizes an <strong>XGBoost (Extreme Gradient Boosting)</strong> classifier trained on customer demographics, subscribed services, and account billing information. The output risk categorization feeds directly into a <strong>Q-Learning reinforcement learning agent</strong> to prescribe the optimal action (e.g., Do Nothing, Offer Discount, or Call Customer) that balances retention probability against operational cost.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech, i) => (
            <span key={i} className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}