// import { type NextApiRequest, type NextApiResponse } from "next";

// import { prisma } from "../../server/db/client";

// import { getServerAuthSession } from "../../server/common/get-server-auth-session";

// export const bookings = async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getServerAuthSession({ req, res });

//   if (session) {
//     try {
//       const currentMonth = req.query.month;
//       if (typeof currentMonth !== "number") {
//         throw new Error("Invalid month");
//       }
//       const bookings = await getBookings(currentMonth);
//       res.status(200).json({ bookings });
//     } catch (err: unknown) {
//       res.status(500).json({ message: err?.message });
//     }
//   } else {
//     res.send({
//       error: "You must be signed in to access the bookings API.",
//     });
//   }
// };

// async function getBookings(
//   currentMonth: number,
//   currentYear: number
// ): Promise<prisma.Booking[]> {
//   const startOfMonth = new Date(currentYear, currentMonth, 1);
//   const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

//   return await prisma.booking.findMany({
//     where: {
//       OR: [
//         { start: { gte: startOfMonth, lte: endOfMonth } },
//         { end: { gte: startOfMonth, lte: endOfMonth } },
//       ],
//     },
//   });
// }
// export default bookings;
