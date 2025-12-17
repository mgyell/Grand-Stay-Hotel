import React, { useState } from 'react';
import { UserRole, Room, RoomStatus, Booking, Task, Order, VendorInvoice } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS, MOCK_ORDERS, REVENUE_DATA, OCCUPANCY_DATA, MOCK_STAFF, MOCK_INVOICES } from './constants';
import GuestView from './components/GuestView';
import StaffView from './components/StaffView';
import AdminView from './components/AdminView';
import VendorView from './components/VendorView';
import AIChat from './components/AIChat';
import { LogOut, Building2, UserCircle, Briefcase, BarChart3, Truck, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.NONE);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'TSK-001', type: 'MAINTENANCE', description: 'AC Repair', roomNumber: '202', status: 'IN_PROGRESS', priority: 'HIGH', time: '09:00 AM' },
    { id: 'TSK-002', type: 'HOUSEKEEPING', description: 'Daily Cleaning', roomNumber: '102', status: 'PENDING', priority: 'MEDIUM', time: '10:00 AM' }
  ]);
  // Vendor State
  const [vendorOrders, setVendorOrders] = useState<Order[]>(MOCK_ORDERS);
  const [vendorInvoices, setVendorInvoices] = useState<VendorInvoice[]>(MOCK_INVOICES);

  const [notification, setNotification] = useState<string | null>(null);

  // Helper to show temporary notifications
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- HANDLERS ---

  // Guest: Book a Room
  const handleBookRoom = (room: Room) => {
    const newBooking: Booking = {
      id: `RES-${Math.floor(Math.random() * 90000) + 10000}`,
      guestName: 'Current Guest', // Simplified for prototype
      roomNumber: room.number,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'CONFIRMED',
      totalAmount: room.price * 2
    };

    setBookings(prev => [...prev, newBooking]);
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: RoomStatus.RESERVED } : r));
    
    // Auto-generate task for Staff
    const newTask: Task = {
        id: `TSK-${Date.now()}`,
        type: 'HOUSEKEEPING',
        description: `Prepare Room ${room.number} for Arrival`,
        roomNumber: room.number,
        status: 'PENDING',
        priority: 'HIGH',
        time: 'Now'
    };
    setTasks(prev => [newTask, ...prev]);

    showNotification(`Reservation ${newBooking.id} Confirmed!`);
  };

  // Staff: Update Booking Status
  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => {
        if (b.id === bookingId) {
            // Side effects for Room Status based on Booking workflow
            if (status === 'CHECKED_IN') {
                setRooms(r => r.map(room => room.number === b.roomNumber ? { ...room, status: RoomStatus.OCCUPIED } : room));
            } else if (status === 'CHECKED_OUT') {
                setRooms(r => r.map(room => room.number === b.roomNumber ? { ...room, status: RoomStatus.DIRTY } : room));
                // Generate cleaning task
                setTasks(t => [...t, {
                    id: `TSK-${Date.now()}`,
                    type: 'HOUSEKEEPING',
                    description: `Turnover Clean Room ${b.roomNumber}`,
                    roomNumber: b.roomNumber,
                    status: 'PENDING',
                    priority: 'HIGH',
                    time: 'Now'
                }]);
            }
            return { ...b, status };
        }
        return b;
    }));
    showNotification(`Booking ${bookingId} updated to ${status}`);
  };

  // Staff: Update Room Status manually
  const handleRoomStatusUpdate = (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    showNotification(`Room status updated to ${status}`);
  };

  // Staff: Task Management
  const handleAddTask = (task: Task) => {
      setTasks(prev => [task, ...prev]);
      showNotification("New task scheduled");
  };

  const handleUpdateTask = (taskId: string, status: Task['status']) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  // Vendor: Update Order
  const handleUpdateOrder = (id: string, status: Order['status']) => {
      setVendorOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (status === 'COMPLETED') {
          showNotification("Service marked complete. Added to monthly statement.");
      }
  };


  // Context data for AI
  const getContextData = () => {
    return `
      Role: ${currentUserRole}
      Occupancy: ${Math.round((rooms.filter(r => r.status === RoomStatus.OCCUPIED).length / rooms.length) * 100)}%
      Pending Tasks: ${tasks.filter(t => t.status !== 'COMPLETED').length}
      Arrivals Today: ${bookings.filter(b => b.status === 'CONFIRMED').length}
    `;
  };

  const renderContent = () => {
    switch (currentUserRole) {
      case UserRole.GUEST:
        return <GuestView rooms={rooms} onBook={handleBookRoom} />;
      case UserRole.STAFF:
        return (
            <StaffView 
                rooms={rooms} 
                bookings={bookings}
                tasks={tasks}
                onUpdateRoomStatus={handleRoomStatusUpdate}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
            />
        );
      case UserRole.ADMIN:
        return (
            <AdminView 
                revenueData={REVENUE_DATA} 
                occupancyData={OCCUPANCY_DATA} 
                staff={MOCK_STAFF}
                invoices={vendorInvoices}
            />
        );
      case UserRole.VENDOR:
        return <VendorView orders={vendorOrders} invoices={vendorInvoices} onUpdateOrder={handleUpdateOrder} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                    alt="Luxury Hotel" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90"></div>
            </div>

            <div className="relative z-10 max-w-6xl w-full mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                        <span className="text-indigo-200 font-medium tracking-wide text-sm">HOTEL MANAGEMENT SYSTEM</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        Grand Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">HMS</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        A next-generation hospitality platform powered by intelligent automation.
                        Select your portal to begin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Guest Card */}
                    <button 
                        onClick={() => setCurrentUserRole(UserRole.GUEST)}
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-left hover:-translate-y-1 hover:border-indigo-500/50"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UserCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Guest Portal</h3>
                        <p className="text-slate-400 text-sm mb-4">Book stays, view reservations, and manage profile.</p>
                        <div className="flex items-center text-blue-400 text-sm font-semibold">
                            Enter Portal <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Staff Card */}
                    <button 
                        onClick={() => setCurrentUserRole(UserRole.STAFF)}
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-left hover:-translate-y-1 hover:border-green-500/50"
                    >
                         <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Staff Access</h3>
                        <p className="text-slate-400 text-sm mb-4">Front desk operations, housekeeping, and tasks.</p>
                        <div className="flex items-center text-green-400 text-sm font-semibold">
                            Login Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Admin Card */}
                    <button 
                        onClick={() => setCurrentUserRole(UserRole.ADMIN)}
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-left hover:-translate-y-1 hover:border-purple-500/50"
                    >
                         <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Administration</h3>
                        <p className="text-slate-400 text-sm mb-4">Financial reports, analytics, and system settings.</p>
                        <div className="flex items-center text-purple-400 text-sm font-semibold">
                            View Dashboard <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Vendor Card */}
                    <button 
                        onClick={() => setCurrentUserRole(UserRole.VENDOR)}
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-left hover:-translate-y-1 hover:border-orange-500/50"
                    >
                         <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Truck className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Vendor Portal</h3>
                        <p className="text-slate-400 text-sm mb-4">Manage orders, services, and view invoices.</p>
                        <div className="flex items-center text-orange-400 text-sm font-semibold">
                            Partner Login <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
                
                <footer className="mt-20 text-center text-slate-500 text-sm">
                    © 2025 Grand Stay Hotel Group. All rights reserved. System Version 1.1.0
                </footer>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-down flex items-center gap-2 w-max max-w-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
            <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header (Only if logged in) */}
      {currentUserRole !== UserRole.NONE && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentUserRole(UserRole.NONE)}>
              <div className="bg-indigo-600 p-1.5 rounded text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Grand Stay HMS</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Logged in as: <span className="font-bold text-slate-900">{currentUserRole}</span>
              </span>
              <button 
                onClick={() => setCurrentUserRole(UserRole.NONE)}
                className="text-slate-500 hover:text-red-600 transition-colors p-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="">
        {renderContent()}
      </main>

      {/* AI Widget */}
      {currentUserRole !== UserRole.NONE && (
        <AIChat role={currentUserRole} contextData={getContextData()} />
      )}
    </div>
  );
};

export default App;