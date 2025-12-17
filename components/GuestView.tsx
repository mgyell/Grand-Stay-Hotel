import React, { useState, useEffect } from 'react';
import { Room, RoomStatus } from '../types';
import { Calendar, Users, Star, CheckCircle, ArrowRight, ArrowLeft, CreditCard, FileText, Check, Loader2, LogIn, UserPlus, Search, Clock } from 'lucide-react';

interface GuestViewProps {
  rooms: Room[];
  onBook: (room: Room) => void;
}

type ViewState = 'AUTH' | 'SEARCH' | 'ENHANCE' | 'INVOICE' | 'CONFIRMATION';

const ADD_ONS = [
    { id: 'bfast', name: 'Continental Breakfast', price: 25, description: 'Daily buffet breakfast per guest' },
    { id: 'spa', name: 'Spa Access', price: 45, description: 'Full day access to thermal pools' },
    { id: 'pickup', name: 'Airport Transfer', price: 60, description: 'Luxury sedan pickup (One way)' },
    { id: 'late', name: 'Late Check-out', price: 30, description: 'Keep room until 2 PM' },
];

const TAX_RATE = 0.12;

const GuestView: React.FC<GuestViewProps> = ({ rooms, onBook }) => {
  const [viewState, setViewState] = useState<ViewState>('AUTH');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  
  // Booking Data
  const [guestName, setGuestName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState('2023-11-10');
  const [checkOut, setCheckOut] = useState('2023-11-12');
  const [nights, setNights] = useState(2);
  const [bookingId, setBookingId] = useState('');

  // Helper to simulate API delays
  const simulateProcess = (fn: () => void) => {
    setLoading(true);
    setTimeout(() => {
      fn();
      setLoading(false);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(guestName) simulateProcess(() => setViewState('SEARCH'));
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setViewState('ENHANCE');
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    // Fix: Return object structure even when selectedRoom is null to match return type expected by destructuring
    if (!selectedRoom) return { subtotal: 0, tax: 0, total: 0 };
    const roomTotal = selectedRoom.price * nights;
    const servicesTotal = selectedAddOns.reduce((acc, id) => {
        const service = ADD_ONS.find(s => s.id === id);
        return acc + (service ? service.price : 0);
    }, 0);
    const subtotal = roomTotal + servicesTotal;
    const tax = subtotal * TAX_RATE;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handlePayment = () => {
    simulateProcess(() => {
        if (selectedRoom) {
            onBook(selectedRoom);
            setBookingId(`RES-${Math.floor(Math.random() * 100000)}`);
            setViewState('CONFIRMATION');
        }
    });
  };

  // --- Render Steps ---

  if (viewState === 'AUTH') {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Guest</h2>
            <p className="text-slate-500 mt-2">Sign in to manage your stay</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button 
                onClick={() => setAuthMode('LOGIN')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${authMode === 'LOGIN' ? 'bg-white shadow text-indigo-900' : 'text-slate-500'}`}
            >
                Login
            </button>
            <button 
                onClick={() => setAuthMode('REGISTER')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${authMode === 'REGISTER' ? 'bg-white shadow text-indigo-900' : 'text-slate-500'}`}
            >
                Register
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                    type="text" 
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Jane Doe"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="jane@example.com"
                />
            </div>
            {authMode === 'REGISTER' && (
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        required
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2 mt-6"
            >
                {loading ? <Loader2 className="animate-spin" /> : (authMode === 'LOGIN' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                {authMode === 'LOGIN' ? 'Access Account' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (viewState === 'SEARCH') {
    const availableRooms = rooms.filter(r => r.status === RoomStatus.AVAILABLE);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Check-in</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            type="date" 
                            value={checkIn} 
                            onChange={e => setCheckIn(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 [color-scheme:light]"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Check-out</label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            type="date" 
                            value={checkOut} 
                            onChange={e => setCheckOut(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 [color-scheme:light]"
                        />
                    </div>
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Guests</label>
                     <div className="relative">
                        <Users className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>1 Guest</option>
                            <option>2 Guests</option>
                            <option>3 Guests</option>
                            <option>4 Guests</option>
                        </select>
                    </div>
                </div>
                <button className="bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Rooms
                </button>
             </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-6">Available Accommodations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableRooms.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500">No rooms available for the selected dates.</p>
              </div>
          ) : availableRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-slate-100 flex flex-col">
              <div className="h-48 overflow-hidden relative group">
                <img src={room.image} alt={room.type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  {room.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Room {room.number}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                      {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
                    <p className="text-sm text-slate-500">/ night</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  {room.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleSelectRoom(room)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  Select Room <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewState === 'ENHANCE') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => setViewState('SEARCH')} className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-indigo-900 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Enhance Your Stay</h2>
                <p className="text-indigo-100">Select additional services to make your visit unforgettable.</p>
            </div>
            
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ADD_ONS.map((addon) => (
                        <div 
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${selectedAddOns.includes(addon.id) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
                        >
                            <div>
                                <h4 className="font-bold text-slate-900">{addon.name}</h4>
                                <p className="text-sm text-slate-500 mt-1">{addon.description}</p>
                                <p className="font-semibold text-indigo-600 mt-2">+${addon.price}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAddOns.includes(addon.id) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                {selectedAddOns.includes(addon.id) && <Check className="w-4 h-4 text-white" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
                <button 
                    onClick={() => setViewState('INVOICE')}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                    Continue to Invoice <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (viewState === 'INVOICE') {
    const { subtotal, tax, total } = calculateTotal();

    return (
       <div className="max-w-3xl mx-auto px-4 py-8">
         <button onClick={() => setViewState('ENHANCE')} className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Provisional Invoice</h2>
                    <p className="text-slate-400 text-sm">Review your reservation details</p>
                </div>
                <div className="text-right">
                    <div className="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/50 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Payment Required: 14:59
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Guest & Room Info */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Guest Details</p>
                        <p className="font-semibold text-slate-900">{guestName}</p>
                        <p className="text-sm text-slate-500">2 Guests</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reservation Dates</p>
                        <p className="font-semibold text-slate-900">{checkIn} — {checkOut}</p>
                        <p className="text-sm text-slate-500">{nights} Nights</p>
                    </div>
                </div>

                {/* Line Items */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-900">{selectedRoom?.type} (Room {selectedRoom?.number})</p>
                            <p className="text-sm text-slate-500">${selectedRoom?.price} x {nights} nights</p>
                        </div>
                        <p className="font-semibold text-slate-900">${(selectedRoom?.price || 0) * nights}</p>
                    </div>
                    {selectedAddOns.map(id => {
                        const s = ADD_ONS.find(x => x.id === id);
                        return s ? (
                            <div key={id} className="flex justify-between items-center">
                                <p className="text-slate-600">{s.name}</p>
                                <p className="font-medium text-slate-900">${s.price}</p>
                            </div>
                        ) : null;
                    })}
                </div>

                {/* Totals */}
                <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Taxes & Fees (12%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <span className="font-bold text-slate-900 text-lg">Total Amount</span>
                        <span className="font-bold text-indigo-600 text-2xl">${total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FileText className="w-4 h-4" />
                        <span>Invoice #INV-2023-001</span>
                    </div>
                    <button 
                        onClick={handlePayment}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        {loading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                    By confirming, you agree to the Terms & Conditions. Payment is handled by a secure mock gateway.
                </p>
            </div>
        </div>
       </div>
    );
  }

  if (viewState === 'CONFIRMATION') {
    return (
        <div className="min-h-[500px] flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-slate-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed</h2>
                <p className="text-slate-500 mb-8">Thank you, {guestName}. Your reservation is secure.</p>
                
                <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wide font-bold">Booking ID</span>
                            <span className="font-mono font-semibold text-slate-900">{bookingId}</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-slate-400 text-xs uppercase tracking-wide font-bold">Room</span>
                             <span className="font-semibold text-slate-900">#{selectedRoom?.number}</span>
                        </div>
                         <div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wide font-bold">Check-in</span>
                            <span className="font-semibold text-slate-900">{checkIn}</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-slate-400 text-xs uppercase tracking-wide font-bold">Status</span>
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Paid
                             </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={() => window.print()} className="px-6 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        Download Receipt
                    </button>
                    <button onClick={() => setViewState('SEARCH')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return null;
};

export default GuestView;