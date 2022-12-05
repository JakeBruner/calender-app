import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookingsRouter } from "./bookingsRouter";

export const appRouter = router({
  bookings: bookingsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
