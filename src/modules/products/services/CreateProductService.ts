import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
  discount?: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    price,
    quantity,
    discount,
  }: IRequest): Promise<Product> {
    let product = await this.productsRepository.findByName(name);

    if (product) {
      throw new AppError(
        'Product already existent. Create a different one or update quantity for this one.',
      );
    }

    product = await this.productsRepository.create({
      name,
      price,
      quantity,
      discount,
    });

    return product;
  }
}

export default CreateProductService;
