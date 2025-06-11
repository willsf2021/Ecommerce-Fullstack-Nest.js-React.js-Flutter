import { HttpService } from '@nestjs/axios';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ProductDto } from 'src/common/dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  private BRAZILIAN_URL =
    'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
  private EUROPEAN_URL =
    'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

  constructor(private readonly httpService: HttpService) {}

  private getFromBrazilian(): Observable<ProductDto[]> {
    return this.httpService.get(this.BRAZILIAN_URL).pipe(
      map((response) => {
        const products = response.data;
        return products.map(
          (item): ProductDto => ({
            id: item.id,
            name: item.nome,
            description: item.descricao,
            price: parseFloat(item.preco),
            images: [item.imagem],
            category: item.categoria,
            material: item.material,
            department: item.departamento,
            provider: 'brazilian',
          }),
        );
      }),
      catchError((error) => {
        this.logger.error(
          'Erro ao buscar produtos do fornecedor brasileiro',
          error,
        );
        return of([]);
      }),
    );
  }

  private getFromEuropean(): Observable<ProductDto[]> {
    return this.httpService.get(this.EUROPEAN_URL).pipe(
      map((response) => {
        const products = response.data;
        return products.map(
          (item): ProductDto => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            images: item.gallery,
            hasDiscount: item.hasDiscount,
            discountValue: parseFloat(item.discountValue),
            provider: 'european',
          }),
        );
      }),
      catchError((error) => {
        this.logger.error(
          'Erro ao buscar produtos do fornecedor europeu',
          error,
        );
        return of([]);
      }),
    );
  }

  findAll(): Observable<ProductDto[]> {
    return forkJoin([this.getFromBrazilian(), this.getFromEuropean()]).pipe(
      map(([brazilian, european]) => {
        return [...brazilian, ...european];
      }),
    );
  }

  findOneByCompositeId(compositeId: string): Observable<ProductDto> {
    const [provider, idStr] = compositeId.split('-');
    const id = parseInt(idStr);
    if (!provider || isNaN(id)) {
      throw new HttpException(
        'Formato de compositeId inválido. Use o formato provider-id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (provider === 'brazilian') {
      return this.httpService.get(`${this.BRAZILIAN_URL}/${id}`).pipe(
        map((response) => {
          const item = response.data;
          const product: ProductDto = {
            id: item.id,
            name: item.nome,
            description: item.descricao,
            price: parseFloat(item.preco),
            images: [item.imagem],
            category: item.categoria,
            material: item.material,
            department: item.departamento,
            provider: 'brazilian',
          };
          return product;
        }),
        catchError((error) => {
          this.logger.error(
            `Erro ao buscar produto brasileiro com id ${id}`,
            error,
          );
          throw new HttpException(
            'Produto não encontrado',
            HttpStatus.NOT_FOUND,
          );
        }),
      );
    } else if (provider === 'european') {
      return this.httpService.get(`${this.EUROPEAN_URL}/${id}`).pipe(
        map((response) => {
          const item = response.data;
          const product: ProductDto = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            images: item.gallery,
            hasDiscount: item.hasDiscount,
            discountValue: parseFloat(item.discountValue),
            provider: 'european',
          };
          return product;
        }),
        catchError((error) => {
          this.logger.error(
            `Erro ao buscar produto europeu com id ${id}`,
            error,
          );
          throw new HttpException(
            'Produto não encontrado',
            HttpStatus.NOT_FOUND,
          );
        }),
      );
    } else {
      throw new HttpException(
        'Fornecedor inválido no compositeId',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
