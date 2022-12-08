import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const bookingsRouter = router({
  getByMonth: protectedProcedure
    .input(z.tuple([z.number().min(0).max(11), z.number().min(2020).max(2030)]))
    .query(({ ctx, input }) => {
      const [month, year] = input;
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
      } else {
        return ctx.prisma.booking.findMany({
          where: {
            OR: [
              { start: { gte: start, lte: end } },
              { end: { gte: start, lte: end } },
            ],
          },
          select: {
            id: true,
            start: true,
            end: true,
          },
        });
      }
    }),
});
