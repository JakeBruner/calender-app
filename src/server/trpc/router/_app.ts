import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookingsRouter } from "./bookingsRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = router({
  bookings: bookingsRouter,
  auth: authRouter,
  usersRouter: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
