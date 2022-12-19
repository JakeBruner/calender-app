// import type { RouterOutputs } from "../utils/trpc";

export type SelectedRange = [Date | null, Date | null];

export interface Day {
  date: Date;
  isCurrentMonth?: boolean;
  isToday?: boolean;
}
export interface DayWithBookingInfo {
  id: string;
  title: string;
  author: string | null;
  location: Location;
  start: Date;
  end: Date;
  isStart: boolean;
  isMonday: boolean;
}

// import type { inferRouterOutputs } from "@trpc/server";
// import type { AppRouter } from "../server/trpc/router/_app";
// export type Booking = inferRouterOutputs<AppRouter>["bookings"]["getAll"][0];
// export type Location = Booking["location"] extends infer T
//   ? T
//   : Booking["location"];

// export type Booking = RouterOutputs["bookings"]["getAll"][0];
export type Booking = {
  end: Date;
  id: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  sharedUsers:
    | {
        id: string;
        name: string | null;
        image: string | null;
      }[]
    | undefined
    | null;
  start: Date;
  title: string;
  location: Location;
  message: string | null;
};

export type Location = "L1" | "L2" | "L3" | "L4" | "OTHER";

export type BookingID = string;

// type Tab = {
//   name: string;
//   href: string;
//   current: boolean;
// };
