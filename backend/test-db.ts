import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const count = await prisma.product.count();
  console.log('Product count:', count);
  
  const product = await prisma.product.findFirst({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });
  console.log('First product:', product);
  
  await prisma.$disconnect();
}

main().catch(console.error);
