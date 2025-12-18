
import React, { useState } from 'react';
import { Order, VendorInvoice } from '../types.ts';
import { Package, Truck, CheckCircle2, FileText, Upload, Clock, DollarSign, Wrench, Play, CheckSquare, Download, LayoutDashboard } from 'lucide-react';

interface VendorViewProps {
  orders: Order[];
  invoices: VendorInvoice[];
  onUpdateOrder: (id: string, status: Order['status']) => void;
}

type Tab = 'DASHBOARD' | 'SERVICES' | 'FINANCIALS';

const VendorView: React.FC<VendorViewProps> = ({ orders, invoices, onUpdateOrder }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

  // Stats
  const activeJobs = orders.filter(o => o.status === 'PENDING' || o.status === 'IN_PROGRESS' || o.status === 'ACCEPTED').length;
  const completedUnbilled = orders.filter(o => o.status === 'COMPLETED').reduce((acc, curr) => acc + curr.amount, 0);
  const totalEarnings = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);

  const Dashboard = () => (
      <div className="space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <Wrench className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-slate-900">{activeJobs}</h3>
                    <span className="text-xs text-slate-400">Requires Attention</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Completed (Unbilled)</p>
                    <h3 className="text-2xl font-bold text-slate-900">${completedUnbilled.toFixed(2)}</h3>
                    <span className="text-xs text-slate-400">Ready for Invoice</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-slate-900">${totalEarnings.toLocaleString()}</h3>
                    <span className="text-xs text-slate-400">YTD Revenue</span>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                           <div className={`p-2 rounded-full ${order.type === 'SERVICE' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                               {order.type === 'SERVICE' ? <Wrench className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                           </div>
                           <div className="flex-1">
                               <p className="font-semibold text-slate-900">{order.item}</p>
                               <p className="text-sm text-slate-500">{order.type} • {order.date}</p>
                           </div>
                           <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">
                               {order.status}
                           </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const ServiceRequests = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-900 text-lg">Assigned Requests</h3>
             <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 rounded-lg hover:bg-slate-200">All</button>
                 <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg">Pending</button>
                 <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg">Completed</button>
             </div>
        </div>
        <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                          {order.type === 'SERVICE' ? <Wrench className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                      </div>
                      <div>
                          <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900">{order.item}</h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-200 text-slate-600">
                                  {order.id}
                              </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                              {order.type} • Requested on {order.date}
                          </p>
                          <p className="text-sm font-semibold text-indigo-600 mt-1">
                              Charge: ${order.amount.toFixed(2)}
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-3">
                      {order.status === 'PENDING' && (
                          <button 
                            onClick={() => onUpdateOrder(order.id, 'ACCEPTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm"
                          >
                              <Play className="w-4 h-4" /> Accept Job
                          </button>
                      )}
                      
                      {(order.status === 'ACCEPTED' || order.status === 'IN_PROGRESS') && (
                          <button 
                            onClick={() => onUpdateOrder(order.id, 'COMPLETED')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 shadow-sm"
                          >
                              <CheckCircle2 className="w-4 h-4" /> Mark Complete
                          </button>
                      )}

                      {(order.status === 'COMPLETED' || order.status === 'DELIVERED') && (
                           <div className="flex items-center gap-2 text-green-600 font-semibold text-sm px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                               <CheckCircle2 className="w-4 h-4" /> Done
                           </div>
                      )}
                  </div>
              </div>
            ))}
        </div>
    </div>
  );

  const Financials = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
              <div>
                  <p className="text-slate-400 mb-1">Unbilled Amount</p>
                  <h2 className="text-4xl font-bold">${completedUnbilled.toFixed(2)}</h2>
                  <p className="text-sm text-slate-400 mt-2">Cycle ends: Oct 31, 2025</p>
              </div>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Generate Statement
              </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Payment History</h3>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                      <tr>
                          <th className="px-6 py-4">Invoice ID</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Download</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-mono text-sm text-slate-600">{inv.id}</td>
                              <td className="px-6 py-4 text-sm text-slate-900">{inv.date}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{inv.serviceType}</td>
                              <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                                    ${inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : ''}
                                  `}>
                                      {inv.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                      <Download className="w-4 h-4" />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
             <div className="mb-8 px-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-indigo-200">
                    CS
                </div>
                <h2 className="font-bold text-slate-900">CleanCo Services</h2>
                <p className="text-xs text-slate-500">Authorized Vendor</p>
             </div>

             <nav className="space-y-1">
                <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'DASHBOARD' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('SERVICES')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'SERVICES' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <Wrench className="w-5 h-5" /> Service Requests
                </button>
                <button 
                    onClick={() => setActiveTab('FINANCIALS')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'FINANCIALS' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <FileText className="w-5 h-5" /> Financials
                </button>
             </nav>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
             <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    {activeTab === 'DASHBOARD' && 'Vendor Dashboard'}
                    {activeTab === 'SERVICES' && 'Service Queue'}
                    {activeTab === 'FINANCIALS' && 'Statements & Invoices'}
                </h1>
                <p className="text-slate-500">Manage your hotel service assignments</p>
            </header>
            
            {activeTab === 'DASHBOARD' && <Dashboard />}
            {activeTab === 'SERVICES' && <ServiceRequests />}
            {activeTab === 'FINANCIALS' && <Financials />}
        </div>
    </div>
  );
};

export default VendorView;
