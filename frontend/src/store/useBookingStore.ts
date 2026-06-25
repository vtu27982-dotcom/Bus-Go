import { create } from 'zustand';

interface BookingState {
  selectedSchedule: any | null;
  selectedSeats: string[];
  passengers: any[];
  setSchedule: (schedule: any) => void;
  addSeat: (seat: string) => void;
  removeSeat: (seat: string) => void;
  setPassengers: (passengers: any[]) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedSchedule: null,
  selectedSeats: [],
  passengers: [],
  setSchedule: (schedule) => set({ selectedSchedule: schedule, selectedSeats: [], passengers: [] }),
  addSeat: (seat) => set((state) => ({ selectedSeats: [...state.selectedSeats, seat] })),
  removeSeat: (seat) => set((state) => ({ selectedSeats: state.selectedSeats.filter(s => s !== seat) })),
  setPassengers: (passengers) => set({ passengers }),
  clearBooking: () => set({ selectedSchedule: null, selectedSeats: [], passengers: [] }),
}));
