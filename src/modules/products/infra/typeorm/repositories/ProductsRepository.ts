import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const products_ids = [...products.map(product => product.id)];
    const product = await this.ormRepository.find({
      where: {
        id: In(products_ids),
      },
    });

    return product;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const products_ids = [...products.map(product => product.id)];
    const queryProducts = await this.ormRepository.find({
      where: {
        id: In(products_ids),
      },
    });

    products.forEach(product => {
      const idx = queryProducts.findIndex(item => item.id === product.id);

      if (idx < 0) {
        throw new AppError('Product not found');
      }

      queryProducts[idx].quantity -= product.quantity;
    });

    await this.ormRepository.save(queryProducts);
    return queryProducts;
  }
}

export default ProductsRepository;
