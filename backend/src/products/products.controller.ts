import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isNew') isNew?: string,
    @Query('isBestSeller') isBestSeller?: string,
    @Query('sortBy') sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular',
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;

    return this.productsService.findAll({
      skip,
      take: limitNum,
      categorySlug,
      search,
      tags: tags ? tags.split(',') : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      isFeatured: isFeatured === 'true' ? true : undefined,
      isNew: isNew === 'true' ? true : undefined,
      isBestSeller: isBestSeller === 'true' ? true : undefined,
      sortBy,
    });
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  @Get(':id/reviews')
  async getProductReviews(
    @Param('id') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

    return this.productsService.getProductReviews(productId, skip, limitNum);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':id/reviews')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Param('id') productId: string,
    @Req() req: Request & { user: any },
    @Body()
    data: {
      rating: number;
      title?: string;
      comment?: string;
    },
  ) {
    const userId = req.user.id;

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return this.productsService.createReview(productId, userId, data);
  }
}
