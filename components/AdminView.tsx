
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartData, StaffMember, VendorInvoice } from '../types.ts';
import { 
  TrendingUp, Users, DollarSign, Activity, FileText, Download, 
  Briefcase, CreditCard, AlertCircle, CheckCircle, PieChart as PieChartIcon,
  LayoutGrid
} from 'lucide-react';

interface AdminViewProps {
  revenueData: ChartData[];
  occupancyData: ChartData[];
  staff: StaffMember[];
  invoices: VendorInvoice[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];
type Tab = 'OVERVIEW' | 'STAFF' | 'FINANCE' | 'REPORTS';

const AdminView: React.FC<AdminViewProps> = ({ revenueData, occupancyData, staff, invoices }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const simulateReportGeneration = (reportName: string) => {
    setGeneratingReport(reportName);
    setTimeout(() => {
      setGeneratingReport(null);
      alert(`${reportName} generated successfully!`);
    }, 2000);
  };

  const Overview = () => (
    <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">$45,230</h3>
                    <span className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs last month</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Active Guests</p>
                    <h3 className="text-2xl font-bold text-slate-900">142</h3>
                    <span className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5% this week</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">ADR (Daily Rate)</p>
                    <h3 className="text-2xl font-bold text-slate-900">$215</h3>
                    <span className="text-xs text-slate-400">Target: $220</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Staff On Duty</p>
                    <h3 className="text-2xl font-bold text-slate-900">{staff.filter(s => s.status === 'ACTIVE').length} / {staff.length}</h3>
                    <span className="text-xs text-slate-400">Shift A</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trends (Weekly)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            cursor={{fill: '#f1f5f9'}}
                        />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Real-time Occupancy</h3>
                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    {occupancyData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                            <span className="text-sm text-slate-600">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const StaffManagement = () => (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                  <h3 className="text-lg font-bold text-slate-900">Staff Directory</h3>
                  <p className="text-slate-500 text-sm">Manage roles, shifts, and status</p>
              </div>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">
                  Add New Staff
              </button>
          </div>
          <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                  <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Shift</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {staff.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">{member.id}</td>
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                      {member.name.charAt(0)}
                                  </div>
                                  <span className="font-semibold text-slate-900">{member.name}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{member.role}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{member.shift}</td>
                          <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                                ${member.status === 'OFF_DUTY' ? 'bg-slate-100 text-slate-800' : ''}
                                ${member.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' : ''}
                              `}>
                                  {member.status.replace('_', ' ')}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const Financials = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-sm mb-1">Accounts Payable</p>
                  <p className="text-2xl font-bold text-slate-900">$8,900.50</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-red-500 h-full w-[45%]"></div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-sm mb-1">Paid this Month</p>
                  <p className="text-2xl font-bold text-slate-900">$12,450.00</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-green-500 h-full w-[75%]"></div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-sm mb-1">Pending Invoices</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[25%]"></div>
                  </div>
              </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Vendor Invoices</h3>
                  <button className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-1">
                      <Download className="w-4 h-4" /> Export CSV
                  </button>
              </div>
              <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                      <tr>
                          <th className="px-6 py-4">Invoice #</th>
                          <th className="px-6 py-4">Vendor</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-mono text-sm text-slate-600">{inv.id}</td>
                              <td className="px-6 py-4 font-semibold text-slate-900">{inv.vendorName}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{inv.serviceType}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{inv.date}</td>
                              <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                                    ${inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : ''}
                                  `}>
                                      {inv.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                                      {inv.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const Reports = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {[
              { id: 'rev', title: 'Monthly Revenue Report', desc: 'Detailed breakdown of room revenue, F&B, and amenities.', type: 'Financial' },
              { id: 'occ', title: 'Occupancy Analysis', desc: 'Guest demographics, stay duration, and room utilization stats.', type: 'Operations' },
              { id: 'inv', title: 'Inventory Audit', desc: 'Stock levels for housekeeping, kitchen, and maintenance.', type: 'Logistics' },
              { id: 'pay', title: 'Payroll Summary', desc: 'Staff hours, overtime, and salary disbursement records.', type: 'HR' },
              { id: 'tax', title: 'Tax Compliance', desc: 'Collected taxes report for regulatory submission.', type: 'Legal' },
          ].map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                          <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border border-slate-100 px-2 py-1 rounded">
                          {report.type}
                      </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1">{report.desc}</p>
                  <button 
                    onClick={() => simulateReportGeneration(report.title)}
                    disabled={!!generatingReport}
                    className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                      {generatingReport === report.title ? (
                          <>Generating...</>
                      ) : (
                          <><Download className="w-4 h-4" /> Generate Report</>
                      )}
                  </button>
              </div>
          ))}
      </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
         {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Admin Console</h2>
            <nav className="space-y-2">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <LayoutGrid className="w-5 h-5" /> Overview
                </button>
                <button 
                     onClick={() => setActiveTab('STAFF')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'STAFF' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <Users className="w-5 h-5" /> Staff Records
                </button>
                <button 
                     onClick={() => setActiveTab('FINANCE')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'FINANCE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <CreditCard className="w-5 h-5" /> Billing & Vendor
                </button>
                <button 
                     onClick={() => setActiveTab('REPORTS')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'REPORTS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <FileText className="w-5 h-5" /> Reports
                </button>
            </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                    ADM
                </div>
                <div>
                    <p className="text-sm font-bold">System Admin</p>
                    <p className="text-xs text-slate-400">Grand Stay HQ</p>
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
          <header className="mb-8 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {activeTab === 'OVERVIEW' && 'Executive Dashboard'}
                    {activeTab === 'STAFF' && 'Human Resources'}
                    {activeTab === 'FINANCE' && 'Financial Overview'}
                    {activeTab === 'REPORTS' && 'Management Reports'}
                </h1>
                <p className="text-slate-500">
                    Real-time hotel management & analytics
                </p>
             </div>
             <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> System Operational
                 </span>
             </div>
          </header>

          {activeTab === 'OVERVIEW' && <Overview />}
          {activeTab === 'STAFF' && <StaffManagement />}
          {activeTab === 'FINANCE' && <Financials />}
          {activeTab === 'REPORTS' && <Reports />}
      </div>
    </div>
  );
};

export default AdminView;
