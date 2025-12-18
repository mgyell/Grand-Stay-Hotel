
import React, { useState } from 'react';
import { Room, RoomStatus, Booking, Task } from '../types.ts';
import { 
  LayoutDashboard, CalendarDays, ClipboardList, Wrench, 
  CheckCircle, Clock, AlertTriangle, User, LogIn, LogOut, 
  BedDouble, Search, MoreVertical, Plus
} from 'lucide-react';

interface StaffViewProps {
  rooms: Room[];
  bookings: Booking[];
  tasks: Task[];
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, status: Task['status']) => void;
}

type Tab = 'DASHBOARD' | 'FRONT_DESK' | 'HOUSEKEEPING' | 'MAINTENANCE';

const StaffView: React.FC<StaffViewProps> = ({ 
  rooms, bookings, tasks, 
  onUpdateRoomStatus, onUpdateBookingStatus, onAddTask, onUpdateTask 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

  // --- STATS ---
  const arrivalsToday = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'READY').length;
  const departuresToday = bookings.filter(b => b.status === 'CHECKED_IN' && b.checkOut === new Date().toISOString().split('T')[0]).length || 1; // Mocked > 0 for demo
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const maintenanceIssues = tasks.filter(t => t.type === 'MAINTENANCE' && t.status !== 'COMPLETED').length;

  // --- COMPONENTS ---

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Arrivals Today</h3>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><LogIn className="w-5 h-5"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{arrivalsToday}</p>
          <p className="text-xs text-slate-400 mt-1">Expected Check-ins</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Departures</h3>
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><LogOut className="w-5 h-5"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{departuresToday}</p>
          <p className="text-xs text-slate-400 mt-1">Scheduled Check-outs</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Housekeeping</h3>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><ClipboardList className="w-5 h-5"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingTasks}</p>
          <p className="text-xs text-slate-400 mt-1">Pending Tasks</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Maintenance</h3>
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertTriangle className="w-5 h-5"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{maintenanceIssues}</p>
          <p className="text-xs text-slate-400 mt-1">Active Issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Room Status Overview</h3>
            <div className="grid grid-cols-5 gap-2">
                {rooms.map(room => (
                    <div key={room.id} className={`aspect-square rounded-lg flex flex-col items-center justify-center border-2 text-xs font-bold
                        ${room.status === RoomStatus.AVAILABLE ? 'border-green-100 bg-green-50 text-green-700' : ''}
                        ${room.status === RoomStatus.OCCUPIED ? 'border-blue-100 bg-blue-50 text-blue-700' : ''}
                        ${room.status === RoomStatus.DIRTY ? 'border-red-100 bg-red-50 text-red-700' : ''}
                        ${room.status === RoomStatus.MAINTENANCE ? 'border-orange-100 bg-orange-50 text-orange-700' : ''}
                        ${room.status === RoomStatus.RESERVED ? 'border-yellow-100 bg-yellow-50 text-yellow-700' : ''}
                    `}>
                        <span>{room.number}</span>
                        <span className="scale-75 opacity-70">{room.status.substring(0,3)}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Shift Updates</h3>
            <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-slate-900 font-medium">Shift handover complete</p>
                        <p className="text-slate-500 text-xs">10 minutes ago • System</p>
                    </div>
                </div>
                <div className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-slate-900 font-medium">VIP Guest Arrival: Room 301</p>
                        <p className="text-slate-500 text-xs">2 hours ago • Concierge</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const FrontDesk = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Reservation Management</h3>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search guest..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{booking.guestName}</p>
                            <p className="text-xs text-slate-500">{booking.id}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                {booking.roomNumber}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                            {booking.checkIn} <span className="text-slate-400">→</span> {booking.checkOut}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${booking.status === 'CONFIRMED' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${booking.status === 'READY' ? 'bg-green-100 text-green-800' : ''}
                                ${booking.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-800' : ''}
                                ${booking.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                                {booking.status.replace('_', ' ')}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {booking.status === 'CONFIRMED' && (
                               <button 
                                onClick={() => onUpdateBookingStatus(booking.id, 'READY')}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700"
                               >
                                   Process
                               </button>
                           )}
                           {booking.status === 'READY' && (
                               <button 
                                onClick={() => onUpdateBookingStatus(booking.id, 'CHECKED_IN')}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 flex items-center gap-1 ml-auto"
                               >
                                   <LogIn className="w-3 h-3" /> Check In
                               </button>
                           )}
                           {booking.status === 'CHECKED_IN' && (
                               <button 
                                onClick={() => onUpdateBookingStatus(booking.id, 'CHECKED_OUT')}
                                className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-900 flex items-center gap-1 ml-auto"
                               >
                                   <LogOut className="w-3 h-3" /> Check Out
                               </button>
                           )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const Housekeeping = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Task List */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Active Tasks</h3>
                    <button className="text-indigo-600 text-sm font-semibold hover:bg-indigo-50 px-3 py-1 rounded">
                        + Assign Manual Task
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                      {tasks.filter(t => t.type === 'HOUSEKEEPING' && t.status !== 'COMPLETED').map(task => (
                          <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                              <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                      <BedDouble className="w-5 h-5" />
                                  </div>
                                  <div>
                                      <p className="font-semibold text-slate-900">{task.description}</p>
                                      <p className="text-xs text-slate-500">Room {task.roomNumber} • Assigned to: Unassigned</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-slate-400">{task.time}</span>
                                  <button 
                                    onClick={() => onUpdateTask(task.id, 'COMPLETED')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Mark Complete"
                                  >
                                      <CheckCircle className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      ))}
                      {tasks.filter(t => t.type === 'HOUSEKEEPING' && t.status !== 'COMPLETED').length === 0 && (
                          <div className="p-8 text-center text-slate-500">
                              All housekeeping tasks caught up!
                          </div>
                      )}
                  </div>
              </div>

              {/* Dirty Rooms Quick View */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Dirty Rooms</h3>
                  <div className="space-y-3">
                      {rooms.filter(r => r.status === RoomStatus.DIRTY).map(room => (
                          <div key={room.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                              <span className="font-bold text-red-900">Room {room.number}</span>
                              <button 
                                onClick={() => onUpdateRoomStatus(room.id, RoomStatus.AVAILABLE)}
                                className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                              >
                                  Mark Clean
                              </button>
                          </div>
                      ))}
                      {rooms.filter(r => r.status === RoomStatus.DIRTY).length === 0 && (
                          <p className="text-sm text-slate-500">No rooms currently marked dirty.</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );

  const Maintenance = () => (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
           <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">Maintenance Log</h3>
                <button 
                    onClick={() => {
                        onAddTask({
                            id: `TSK-${Date.now()}`,
                            type: 'MAINTENANCE',
                            description: 'New Issue Reported',
                            roomNumber: '---',
                            status: 'PENDING',
                            priority: 'MEDIUM',
                            time: 'Now'
                        });
                    }}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-800"
                >
                    <Plus className="w-4 h-4" /> Report Issue
                </button>
           </div>
           <div className="p-6 grid gap-4">
                {tasks.filter(t => t.type === 'MAINTENANCE').map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                <Wrench className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-bold ${task.status === 'COMPLETED' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.description}</h4>
                                <p className="text-sm text-slate-500">Room: {task.roomNumber} • Priority: {task.priority}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {task.status}
                            </span>
                            {task.status !== 'COMPLETED' && (
                                <button 
                                    onClick={() => onUpdateTask(task.id, 'COMPLETED')}
                                    className="text-sm text-indigo-600 font-semibold hover:underline"
                                >
                                    Resolve
                                </button>
                            )}
                        </div>
                    </div>
                ))}
           </div>
      </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'DASHBOARD' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('FRONT_DESK')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'FRONT_DESK' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CalendarDays className="w-5 h-5" /> Front Desk
          </button>
          <button 
            onClick={() => setActiveTab('HOUSEKEEPING')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'HOUSEKEEPING' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardList className="w-5 h-5" /> Housekeeping
          </button>
          <button 
             onClick={() => setActiveTab('MAINTENANCE')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'MAINTENANCE' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Wrench className="w-5 h-5" /> Maintenance
          </button>
        </div>
        
        <div className="mt-auto p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    JS
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">John Smith</p>
                    <p className="text-xs text-slate-500">Shift Manager</p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    {activeTab === 'DASHBOARD' && 'Operations Dashboard'}
                    {activeTab === 'FRONT_DESK' && 'Front Desk & Reservations'}
                    {activeTab === 'HOUSEKEEPING' && 'Housekeeping Schedule'}
                    {activeTab === 'MAINTENANCE' && 'Facility Maintenance'}
                </h1>
                <p className="text-slate-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </header>

            {activeTab === 'DASHBOARD' && <Dashboard />}
            {activeTab === 'FRONT_DESK' && <FrontDesk />}
            {activeTab === 'HOUSEKEEPING' && <Housekeeping />}
            {activeTab === 'MAINTENANCE' && <Maintenance />}
        </div>
      </div>
    </div>
  );
};

export default StaffView;
