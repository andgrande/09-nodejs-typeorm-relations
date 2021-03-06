import Product from '../infra/typeorm/entities/Product';

import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateProductsQuantityDTO';
import IUpdateProductsDiscountDTO from '../dtos/IUpdateProductsDiscountDTO';

interface IFindProducts {
  id: string;
}

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findByName(name: string): Promise<Product | undefined>;
  findById(id: string): Promise<Product | undefined>;
  findAllById(products: IFindProducts[]): Promise<Product[]>;
  updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
  updateDiscount(products: IUpdateProductsDiscountDTO): Promise<Product>;
}
