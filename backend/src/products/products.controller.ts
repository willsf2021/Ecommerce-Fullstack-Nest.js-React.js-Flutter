import { Controller, Get, ParseIntPipe, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';
import { ProductDto } from 'src/common/dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(): Observable<any[]> {
    return this.productsService.findAll();
  }

  @Get(':compositeId')
  getProductByCompositeId(
    @Param('compositeId') compositeId: string,
  ): Observable<ProductDto> {
    return this.productsService.findOneByCompositeId(compositeId);
  }
}
