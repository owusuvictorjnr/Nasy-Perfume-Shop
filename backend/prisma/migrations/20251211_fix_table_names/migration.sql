-- Rename tables to match @@map directives
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Address" RENAME TO "addresses";
ALTER TABLE "Category" RENAME TO "categories";
ALTER TABLE "Product" RENAME TO "products";
ALTER TABLE "Variant" RENAME TO "product_variants";
ALTER TABLE "Tag" RENAME TO "product_tags";
ALTER TABLE "Order" RENAME TO "orders";
ALTER TABLE "OrderItem" RENAME TO "order_items";
ALTER TABLE "CartItem" RENAME TO "cart_items";
ALTER TABLE "Review" RENAME TO "reviews";
ALTER TABLE "Page" RENAME TO "pages";
ALTER TABLE "Menu" RENAME TO "menus";
ALTER TABLE "Setting" RENAME TO "settings";
