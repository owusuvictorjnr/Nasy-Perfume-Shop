import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating sample products...');

  // Create a category
  const category = await prisma.category.upsert({
    where: { slug: 'perfumes' },
    update: {},
    create: {
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'Premium perfumes',
      order: 1,
      isActive: true,
    },
  });

  console.log('✅ Category created');

  // Create sample products
  const products = [
    {
      name: 'Lavender Dreams',
      slug: 'lavender-dreams',
      sku: 'LAV-001',
      description: 'A soothing lavender fragrance',
      basePrice: 49.99,
      salePrice: 39.99,
      stockQuantity: 100,
      status: 'PUBLISHED' as const,
      isInStock: true,
      isFeatured: true,
      isNew: true,
      categoryId: category.id,
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      ],
    },
    {
      name: 'Ocean Breeze',
      slug: 'ocean-breeze',
      sku: 'OCN-001',
      description: 'Fresh ocean scent',
      basePrice: 59.99,
      stockQuantity: 50,
      status: 'PUBLISHED' as const,
      isInStock: true,
      isFeatured: true,
      categoryId: category.id,
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      ],
    },
    {
      name: 'Rose Garden',
      slug: 'rose-garden',
      sku: 'RSE-001',
      description: 'Elegant rose fragrance',
      basePrice: 69.99,
      salePrice: 54.99,
      stockQuantity: 75,
      status: 'PUBLISHED' as const,
      isInStock: true,
      isBestSeller: true,
      categoryId: category.id,
      images: [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
      ],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        isInStock: product.isInStock,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        images: product.images,
      },
      create: product,
    });
  }

  console.log('✅ Sample products created!');
  console.log(`Total products: ${await prisma.product.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
