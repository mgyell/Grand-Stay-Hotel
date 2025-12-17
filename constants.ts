import { Room, RoomStatus, RoomType, Booking, Order, ChartData, StaffMember, VendorInvoice } from './types';

export const MOCK_ROOMS: Room[] = [
  { id: '101', number: '101', type: RoomType.STANDARD, status: RoomStatus.AVAILABLE, price: 150, image: 'https://picsum.photos/400/300?random=1', features: ['Queen Bed', 'Wifi', 'City View'] },
  { id: '102', number: '102', type: RoomType.STANDARD, status: RoomStatus.OCCUPIED, price: 150, image: 'https://picsum.photos/400/300?random=2', features: ['Queen Bed', 'Wifi', 'City View'] },
  { id: '103', number: '103', type: RoomType.STANDARD, status: RoomStatus.DIRTY, price: 150, image: 'https://picsum.photos/400/300?random=3', features: ['Twin Beds', 'Wifi'] },
  { id: '201', number: '201', type: RoomType.DELUXE, status: RoomStatus.AVAILABLE, price: 300, image: 'https://picsum.photos/400/300?random=4', features: ['King Bed', 'Balcony', 'Ocean View', 'Mini Bar'] },
  { id: '202', number: '202', type: RoomType.DELUXE, status: RoomStatus.MAINTENANCE, price: 300, image: 'https://picsum.photos/400/300?random=5', features: ['King Bed', 'Balcony', 'Mini Bar'] },
  { id: '301', number: '301', type: RoomType.PRESIDENTIAL, status: RoomStatus.AVAILABLE, price: 1200, image: 'https://picsum.photos/400/300?random=6', features: ['Penthouse', 'Private Pool', 'Butler Service', 'Jacuzzi'] },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'BKG-001', guestName: 'Alice Johnson', roomNumber: '102', checkIn: '2025-10-25', checkOut: '2025-10-28', status: 'CHECKED_IN', totalAmount: 450 },
  { id: 'BKG-002', guestName: 'Bob Smith', roomNumber: '201', checkIn: '2025-11-01', checkOut: '2025-11-05', status: 'CONFIRMED', totalAmount: 1200 },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-100', item: 'Fresh Linens (Set of 50)', type: 'SUPPLY', quantity: 2, amount: 250.00, status: 'PENDING', vendor: 'LinenPros Inc.', date: '2025-10-26' },
  { id: 'ORD-101', item: 'Deep Clean - Room 301', type: 'SERVICE', quantity: 1, amount: 120.00, status: 'IN_PROGRESS', vendor: 'CleanCo Services', date: '2025-10-20' },
  { id: 'ORD-102', item: 'Lobby AC Maintenance', type: 'SERVICE', quantity: 1, amount: 450.00, status: 'COMPLETED', vendor: 'TechCool HVAC', date: '2025-10-19' },
];

export const REVENUE_DATA: ChartData[] = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5500 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 8000 },
  { name: 'Sat', value: 9500 },
  { name: 'Sun', value: 7000 },
];

export const OCCUPANCY_DATA: ChartData[] = [
  { name: 'Occupied', value: 65 },
  { name: 'Available', value: 25 },
  { name: 'Maintenance', value: 10 },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: 'S001', name: 'John Smith', role: 'Manager', status: 'ACTIVE', shift: 'Morning' },
  { id: 'S002', name: 'Sarah Connor', role: 'Receptionist', status: 'ACTIVE', shift: 'Morning' },
  { id: 'S003', name: 'Mike Ross', role: 'Housekeeping', status: 'OFF_DUTY', shift: 'Evening' },
  { id: 'S004', name: 'Jessica Pearson', role: 'Manager', status: 'ON_LEAVE', shift: 'Morning' },
  { id: 'S005', name: 'Louis Litt', role: 'Security', status: 'ACTIVE', shift: 'Night' },
];

export const MOCK_INVOICES: VendorInvoice[] = [
  { id: 'INV-001', vendorName: 'LinenPros Inc.', amount: 1250.00, date: '2025-10-15', status: 'PAID', serviceType: 'Laundry' },
  { id: 'INV-002', vendorName: 'HotelEssentials', amount: 850.50, date: '2025-10-20', status: 'PENDING', serviceType: 'Supplies' },
  { id: 'INV-003', vendorName: 'Gourmet Foods Ltd', amount: 2300.00, date: '2025-10-22', status: 'PENDING', serviceType: 'Catering' },
  { id: 'INV-004', vendorName: 'TechSolutions', amount: 4500.00, date: '2025-10-01', status: 'OVERDUE', serviceType: 'IT Maintenance' },
];