export type SelectedRange = [Date | null, Date | null];

export interface Day {
  date: Date;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
}

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/trpc/router/_app";
export type Booking = inferRouterOutputs<AppRouter>["bookings"]["getAll"][0];
