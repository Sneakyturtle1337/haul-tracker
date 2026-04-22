import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UpdateTripInput {
    id: TripId;
    totalMiles?: number;
    dropoffLocation?: string;
    date?: string;
    pickupNumber?: string;
    loadId?: string;
    pickupTime?: string;
    pickupTrailerNumber?: string;
    dropTime?: string;
    pickupLocation?: string;
}
export type Timestamp = bigint;
export interface Trip {
    id: TripId;
    status: TripStatus;
    totalMiles: number;
    dropoffLocation: string;
    dateCreated: Timestamp;
    date: string;
    pickupNumber: string;
    loadId: string;
    dateCompleted?: Timestamp;
    earnings: number;
    pickupTime: string;
    pickupTrailerNumber: string;
    dropTime: string;
    pickupLocation: string;
}
export interface CreateTripInput {
    totalMiles: number;
    dropoffLocation: string;
    date: string;
    pickupNumber: string;
    loadId: string;
    pickupTime: string;
    pickupTrailerNumber: string;
    dropTime: string;
    pickupLocation: string;
}
export type TripId = bigint;
export enum TripStatus {
    active = "active",
    completed = "completed"
}
export interface backendInterface {
    completeTrip(id: TripId): Promise<boolean>;
    createTrip(input: CreateTripInput): Promise<Trip>;
    deleteTrip(id: TripId): Promise<boolean>;
    getActiveTrip(): Promise<Trip | null>;
    getCompletedTrips(): Promise<Array<Trip>>;
    getTripById(id: TripId): Promise<Trip | null>;
    updateTrip(input: UpdateTripInput): Promise<boolean>;
}
