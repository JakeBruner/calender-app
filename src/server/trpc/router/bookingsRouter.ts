import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const bookingsRouter = router({
  getByMonth: protectedProcedure.input(z.date()).query(({ ctx, input }) => {
    const month = input.getMonth();
    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return ctx.prisma.booking.findMany({
      where: {
        OR: [
          { start: { gte: start, lte: end } },
          { end: { gte: start, lte: end } },
        ],
      },
    });
  }),
});
