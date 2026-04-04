import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Repair Showcase gallery...");

  const repairs = [
    {
      title: "Tipper Body Restoration",
      description: "Full dent removal and high-durability repaint for a heavy-duty Mahindra Blazo Tipper. Restored to original showroom grade.",
      vehicleType: "Tipper",
      beforeImage: "https://images.unsplash.com/photo-1591768793355-74d7ca736056?auto=format&fit=crop&w=1200&q=80",
      afterImage: "https://images.unsplash.com/photo-162141961-b5d1852de29a?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Luxury Sedan Paint Correction",
      description: "Precision color matching and ceramic coating for a luxury sedan. Removed deep scratches and restored deep gloss shine.",
      vehicleType: "Car",
      beforeImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
      afterImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Commercial Truck Front Repair",
      description: "Replaced front bumper and grille, corrected chassis alignment for an Ashok Leyland truck after minor collision.",
      vehicleType: "Truck",
      beforeImage: "https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&w=1200&q=80",
      afterImage: "https://images.unsplash.com/photo-1562141961-b5d1852de29a?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  for (const r of repairs) {
    await prisma.repairJob.create({ data: r });
  }

  console.log("Seeded 3 repair showcase records.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
