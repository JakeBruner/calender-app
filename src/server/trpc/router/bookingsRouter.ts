import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const bookingsRouter = router({
  getByMonth: protectedProcedure
    // input is an object where month is 0-indexed from 0-11 and year is 2022-2030
    .input(
      z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(2022).max(2030),
      })
    )
    .query(({ ctx, input }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }

      const { month, year } = input;

      const start = new Date(year, month, 1, 0, 0, 0, 0);
      const end = new Date(year, month + 1, 1, 0, 0, 0, 0);

      if (ctx.session.user.role === "ADMIN") {
        return ctx.prisma.booking.findMany({
          where: {
            OR: [
              { start: { gte: start, lte: end } },
              { end: { gte: start, lte: end } },
            ],
          },
        });
      }

      // normal user
      return ctx.prisma.booking
        .findMany({
          where: {
            OR: [
              { start: { gte: start, lte: end } },
              { end: { gte: start, lte: end } },
            ],
            // check is user is in the join tbale for this booking
          },
          select: {
            id: true,
            title: true,
            message: true,
            start: true,
            end: true,
            
              

          },
        })
        .then((booking) => ({
          ...booking,
          sharedWithUser: booking.some((b) =>
            b.
          ),
        }));
    }),
});
