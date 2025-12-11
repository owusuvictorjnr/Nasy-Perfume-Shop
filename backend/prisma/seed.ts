import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { products, users } from '../src/data/data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Users
  console.log('Creating users...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        uid: uuid(),
        email: user.email,
        password: user.password,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        role: user.role === 'Admin' ? 'ADMIN' : 'CUSTOMER',
        emailVerified: user.emailVerified,
      },
    });
  }

  // Seed Products and Categories
  console.log('Creating categories and products...');

  // Map to store category IDs
  const categoryMap = new Map<string, string>();

  for (const product of products) {
    // 1. Handle Category (Parent)
    const categorySlug = product.category.toLowerCase().replace(/ /g, '-');
    let categoryId = categoryMap.get(categorySlug);

    if (!categoryId) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {
          image: product.images[0], // Use first product image for category
        },
        create: {
          name: product.category,
          slug: categorySlug,
          description: `All ${product.category} products`,
          image: product.images[0], // Use first product image for category
          isActive: true,
        },
      });
      categoryId = category.id;
      categoryMap.set(categorySlug, categoryId);
    }

    // 2. Handle Subcategory (Child)
    let subcategoryId = categoryId; // Default to parent if no subcategory
    if (product.subcategory) {
      const subcategorySlug = `${categorySlug}-${product.subcategory.toLowerCase().replace(/ /g, '-')}`;
      let subCatId = categoryMap.get(subcategorySlug);

      if (!subCatId) {
        const subcategory = await prisma.category.upsert({
          where: { slug: subcategorySlug },
          update: {
            image: product.images[0], // Use first product image for subcategory
          },
          create: {
            name: product.subcategory,
            slug: subcategorySlug,
            description: `${product.subcategory} collection`,
            image: product.images[0], // Use first product image for subcategory
            parentId: categoryId,
            isActive: true,
          },
        });
        subCatId = subcategory.id;
        categoryMap.set(subcategorySlug, subCatId);
      }
      subcategoryId = subCatId;
    }

    // 3. Create Product
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        basePrice: product.price,
        salePrice: product.price < product.listPrice ? product.price : null, // Assuming price is sale price if lower
        stockQuantity: product.countInStock,
        isInStock: product.countInStock > 0,
        isFeatured: product.featured,
        isNew: product.newArrival,
        categoryId: subcategoryId,
        images: product.images,
        sku: `SKU-${product.slug}-${Math.floor(Math.random() * 1000)}`, // Generate a SKU
        averageRating: product.avgRating,
        reviewCount: product.numReviews,
        status: 'PUBLISHED',
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.listPrice || product.price,
        salePrice: product.price < product.listPrice ? product.price : null,
        stockQuantity: product.countInStock,
        isInStock: product.countInStock > 0,
        isFeatured: product.featured,
        isNew: product.newArrival,
        categoryId: subcategoryId,
        images: product.images,
        sku: `SKU-${product.slug}-${Math.floor(Math.random() * 1000)}`,
        averageRating: product.avgRating,
        reviewCount: product.numReviews,
        status: 'PUBLISHED',
      },
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
