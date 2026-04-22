export interface Trip {
  id: bigint;
  date: string;
  loadId: string;
  pickupNumber: string;
  pickupTrailerNumber: string;
  pickupTime: string;
  dropTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalMiles: number;
  earnings: number;
  status: string;
  dateCreated: bigint;
  dateCompleted?: bigint;
}

export interface CreateTripInput {
  date: string;
  loadId: string;
  pickupNumber: string;
  pickupTrailerNumber: string;
  pickupTime: string;
  dropTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalMiles: number;
}

export interface UpdateTripInput {
  id: bigint;
  date?: string;
  loadId?: string;
  pickupNumber?: string;
  pickupTrailerNumber?: string;
  pickupTime?: string;
  dropTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  totalMiles?: number;
}

export function isActive(trip: Trip): boolean {
  return trip.status === "active";
}

export function formatEarnings(earnings: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(earnings);
}

export function formatMiles(miles: number): string {
  return `${miles.toLocaleString()} mi`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const RATE_PER_MILE = 0.775;

export function calcEstimatedEarnings(miles: number): number {
  return miles * RATE_PER_MILE;
}
