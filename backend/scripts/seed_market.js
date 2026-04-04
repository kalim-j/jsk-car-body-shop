import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding marketplace with Tippers and Trucks...");

  // Find a seller (the first user)
  const seller = await prisma.user.findFirst();
  if (!seller) {
    console.log("No users found. Please sign up first.");
    return;
  }

  const listings = [
    {
      name: "2022 Tata Signa 4825.TK Tipper",
      brand: "Tata Motors",
      price: 4500000,
      condition: "Used",
      vehicleType: "Tipper",
      year: 2022,
      phone: "7010587940",
      images: JSON.stringify(["https://images.unsplash.com/photo-1586191552066-d52dd1e3af86?auto=format&fit=crop&w=800&q=80"]),
      state: "Tamil Nadu",
      district: "Dharmapuri",
      locationLink: "https://maps.app.goo.gl/CGbPJodN1Qn8ovXc8",
      status: "Approved",
      sellerId: seller.id,
      sellerType: "Independent"
    },
    {
      name: "2023 Ashok Leyland Ecomet 1215",
      brand: "Ashok Leyland",
      price: 2800000,
      condition: "New",
      vehicleType: "Truck",
      year: 2023,
      phone: "9092704777",
      images: JSON.stringify(["https://images.unsplash.com/photo-1591768793355-74d7ca736056?auto=format&fit=crop&w=800&q=80"]),
      state: "Tamil Nadu",
      district: "Salem",
      locationLink: "https://maps.app.goo.gl/CGbPJodN1Qn8ovXc8",
      status: "Approved",
      sellerId: seller.id,
      sellerType: "Independent"
    },
    {
      name: "Mahindra Blazo X 28 Tipper",
      brand: "Mahindra",
      price: 3200000,
      condition: "Repaired",
      vehicleType: "Tipper",
      year: 2021,
      phone: "7010587940",
      images: JSON.stringify(["https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&w=800&q=80"]),
      state: "Tamil Nadu",
      district: "Dharmapuri",
      locationLink: "https://maps.app.goo.gl/CGbPJodN1Qn8ovXc8",
      status: "Approved",
      sellerId: seller.id,
      sellerType: "Independent"
    }
  ];

  for (const l of listings) {
    await prisma.car.create({ data: l });
  }

  console.log("Seeded 3 vehicle listings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
