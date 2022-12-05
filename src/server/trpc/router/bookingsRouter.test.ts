import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const mockPrismaClient = {
  booking: {
    findMany: jest.fn(),
  },
};

const bookingsRouter = router({
  getByMonth: publicProcedure.input(z.date()).query(({ ctx, input }) => {
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

test("getByMonth returns the bookings starting or ending in the provided month", async () => {
  mockPrismaClient.booking.findMany.mockResolvedValue([
    {
      start: new Date("2022-01-03"),
      end: new Date("2022-01-07"),
    },
    {
      start: new Date("2022-01-22"),
      end: new Date("2022-01-27"),
    },
  ]);

  const result = await bookingsRouter.getByMonth.run({
    ctx: { prisma: mockPrismaClient },
    input: new Date("2022-01-01"),
  });

  expect(result).toEqual([
    {
      start: new Date("2022-01-03"),
      end: new Date("2022-01-07"),
    },
    {
      start: new Date("2022-01-22"),
      end: new Date("2022-01-27"),
    },
  ]);
});
