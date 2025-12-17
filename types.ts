export enum UserRole {
  GUEST = 'GUEST',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  NONE = 'NONE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  DIRTY = 'DIRTY',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export enum RoomType {
  STANDARD = 'Standard Room',
  DELUXE = 'Deluxe Suite',
  PRESIDENTIAL = 'Presidential Suite'
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  image: string;
  features: string[];
}

export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'READY';
  totalAmount: number;
}

export interface Order {
  id: string;
  item: string;
  type: 'SUPPLY' | 'SERVICE';
  quantity: number;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';
  vendor: string;
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface Task {
  id: string;
  type: 'HOUSEKEEPING' | 'MAINTENANCE' | 'GUEST_REQ';
  description: string;
  roomNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo?: string;
  time: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Receptionist' | 'Housekeeping' | 'Security';
  status: 'ACTIVE' | 'ON_LEAVE' | 'OFF_DUTY';
  shift: 'Morning' | 'Evening' | 'Night';
}

export interface VendorInvoice {
  id: string;
  vendorName: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  serviceType: string;
}