import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") as string;
  const pageSize = req.nextUrl.searchParams.get("pageSize") as string;
  const query = (req.nextUrl.searchParams.get("query") as string) || "";
  const sortField = req.nextUrl.searchParams.get("sortField") as string;
  const sortOrder = req.nextUrl.searchParams.get("sortOrder") as string;
  const skip = (+page - 1) * +pageSize;

  let sortParams = {};
  if (sortField && sortOrder) {
    sortParams = {
      [sortField]: sortOrder,
    };
  }

  const [records, total] = await Promise.all([
    prisma.vendor.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            tel: {
              contains: query,
              mode: "insensitive",
            },
          },
          // Add other fields you want to include in the search
        ],
      },
      skip: skip,
      take: +pageSize,
      orderBy: sortParams,
    }),
    prisma.vendor.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            tel: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    }),
  ]);

  return NextResponse.json({ records, total });
}

export async function POST(req: Request) {
  const {
    name,
    address,
    tel,
    juristicId,
    taxId,
    contactAddr,
    telContactAddr,
    staffId,
  } = await req.json();
  const newVendor = await prisma.vendor.create({
    data: {
      name,
      address,
      tel,
      juristicId,
      taxId,
      contactAddr,
      telContactAddr,
      staffId,
    },
  });
  return NextResponse.json(newVendor);
}

export async function PUT(req: NextRequest) {
  try {
    const vendorId = req.nextUrl.searchParams.get("vendorId") as string;
    const data = await req.json();

    const updatedVendor = await prisma.vendor.update({
      where: { vendorId },
      data,
    });

    return NextResponse.json({ message: "Updated success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error updating vendor" });
  }
}

export async function DELETE(req: NextRequest) {
  const vendorId = req.nextUrl.searchParams.get("vendorId") as string;
  await prisma.vendor.delete({
    where: { vendorId },
  });
  return NextResponse.json({ message: "Vendor deleted" });
}
