import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

// type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const bookingsRouter = router({
  getAll: protectedProcedure
    // ! for now, we'll just get all bookings since there are only a few
    .query(({ ctx }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }
      // normal user
      return ctx.prisma.booking.findMany({
        select: {
          id: true,
          title: true,
          message: true,
          start: true,
          end: true,
          location: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          // sharedUsers: {
          //   select: {
          //     id: true,
          //     name: true,
          //     image: true,
          //   },
          // },
        },
      });
      // .then((unfilteredBookings) => {
      //   return unfilteredBookings.map((booking) => {
      //     // if the booking is shared with the user, return the booking without author and sharedUsers
      //     if (
      //       booking.sharedUsers.some(
      //         (user) => user.id === ctx.session.user.id
      //       )
      //     ) {
      //       return {
      //         id: booking.id,
      //         title: booking.title,
      //         message: booking.message,
      //         start: booking.start,
      //         end: booking.end,
      //       };
      //     }
      //   });
      // }); //! will filter client side... for now
    }),
  adminGetAll: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("You are not authorized to access this resource");
    }
    return ctx.prisma.booking.findMany({
      select: {
        id: true,
        title: true,
        message: true,
        start: true,
        end: true,
        location: true,
        approved: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        message: z.string().nullable(),
        start: z.date(),
        end: z.date(),
        // location must be L1, L2, L3, L4, OTHER
        location: z.enum(["L1", "L2", "L3", "L4", "OTHER"]),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }
      return ctx.prisma.booking.create({
        data: {
          title: input.title,
          message: input.message,
          start: input.start,
          end: input.end,
          location: input.location,
          approved: ctx.session.user.role === "ADMIN",
          authorId: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        message: z.string().nullable(),
        start: z.date(),
        end: z.date(),
        // location must be L1, L2, L3, L4, OTHER
        location: z.enum(["L1", "L2", "L3", "L4", "OTHER"]),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }
      if (ctx.session.user.role === "ADMIN") {
        return ctx.prisma.booking.updateMany({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            message: input.message,
            start: input.start,
            end: input.end,
            location: input.location,
          },
        });
      }
      // q: how to ensure that the user is the author of the booking?
      // a: use the where clause
      // a: by default, the where clause is an AND


      return ctx.prisma.booking.updateMany({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
        data: {
          title: input.title,
          message: input.message,
          start: input.start,
          end: input.end,
          location: input.location,
        },
      });

    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }
      return ctx.prisma.booking.deleteMany({
        where: {
          id: input,
          authorId: ctx.session.user.id,
        },
      });
    }),
    
  adminDeleteBooking: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      return ctx.prisma.booking.delete({
        where: {
          id: input,
        },
      });
    }),
  adminApproveBooking: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      return ctx.prisma.booking.update({
        where: {
          id: input,
        },
        data: {
          approved: true,
        },
      });
    }),
  adminCountAllBookings: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }
    return ctx.prisma.booking.count();
  }),
});
