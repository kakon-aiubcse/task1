-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID_PARTIAL', 'PENDING_PARTIAL');

-- CreateTable
CREATE TABLE "Bookings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "validDate" TIMESTAMP(3) NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);
