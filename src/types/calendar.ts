export type SelectedRange = [Date | null, Date | null];

export interface Day {
  date: Date;
  isCurrentMonth?: boolean;
  isToday?: boolean;
}
export interface DayWithBookingInfo {
  id: string;
  title: string;
  author: string;
  isStart: boolean;
  isEnd: boolean;
}

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/trpc/router/_app";
export type Booking = inferRouterOutputs<AppRouter>["bookings"]["getAll"][0];
