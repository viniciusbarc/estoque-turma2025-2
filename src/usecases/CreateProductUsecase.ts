import Product from "../entities/Product";
import type { ProductRepositoryInterface } from "../repositories/ProductRepository";

export interface CreateProductUsecaseInterface {
    execute(barcode: string, name: string, orderReferenceDays: number): Product | Error;
}

export class CreateProductUsecase implements CreateProductUsecaseInterface {

    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    public execute(barcode: string, name: string, orderReferenceDays: number): Product | Error {
            try {
                const existingProduct = this.productRepository.findByBarcode(barcode);
                if (existingProduct) {
                    return new Error("Product with this barcode already exists");
                }

                const newProduct = Product.create(barcode, name, orderReferenceDays);
                if (newProduct instanceof Error) {
                    return new Error(newProduct.message);
                }

                const created = this.productRepository.createProduct(newProduct);
                if (created == true) {
                    return newProduct;
                } else {
                    return new Error("Failed to create product");
                }
            } catch (error) {
                return new Error("Error creating product");
            }
    }
}