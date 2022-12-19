import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const usersRouter = router({
  getAllUsers: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }
    // get all
    return ctx.prisma.user.findMany();
  }),
  allowAccess: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }
    return ctx.prisma.user.update({
      where: {
        id: input,
      },
      data: {
        role: "USER",
      },
    });
  }),
  deleteAccount: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      return ctx.prisma.user.delete({
        where: {
          id: input,
        },
      });
    }),
});
