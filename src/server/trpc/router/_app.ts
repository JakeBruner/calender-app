import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookingsRouter } from "./bookings";
import { usersRouter } from "./users";

export const appRouter = router({
  bookings: bookingsRouter,
  auth: authRouter,
  usersRouter: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
