// import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const usersRouter = router({
  getAllUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
