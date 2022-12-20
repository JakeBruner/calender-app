import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

// type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const bookingsRouter = router({
  getAll: protectedProcedure
    //! for now, we'll just get all bookings since there are only a few
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
});
