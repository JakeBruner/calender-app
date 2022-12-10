// import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

// type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const bookingsRouter = router({
  getAll: protectedProcedure
    // // input is an object where month is 0-indexed from 0-11 and year is 2022-2030
    // .input( //! for now, we'll just get all bookings since there are only a few
    //   z.object({
    //     month: z.number().min(0).max(11),
    //     year: z.number().min(2022).max(2030),
    //   })
    // )
    .query(({ ctx }) => {
      if (ctx.session.user.role === "LIMBO") {
        throw new Error("You are not authorized to access this resource");
      }

      // if (ctx.session.user.role === "ADMIN") {
      //   return ctx.prisma.booking.findMany({
      //     where: {
      //     },
      //   });
      // }

      // type Booking = ThenArg<ReturnType<typeof ctx.prisma.booking.findMany>>[0] & ({
      //   author: {
      //     id: string;
      //     name: string | null;
      //     image: string | null;
      //   };
      //   sharedUsers: {
      //     id: string;
      //     name: string | null;
      //     image: string | null;
      //   }[];
      // } | { anonymous: true }
      // );

      // normal user
      return ctx.prisma.booking
        .findMany({
          select: {
            id: true,
            title: true,
            message: true,
            start: true,
            end: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            sharedUsers: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        })
        .catch((err) => {
          throw new Error("Error fetching bookings: ", err);
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
});
