import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateProductUsecaseInterface } from "../usecases/CreateProductUsecase";
import Product from "../entities/Product";

export class CreateProductController {

    private createProductUseCase: CreateProductUsecaseInterface;

    constructor(createProductUseCase: CreateProductUsecaseInterface) {
        this.createProductUseCase = createProductUseCase;
    }

    public async handle(request: FastifyRequest, response: FastifyReply): Promise<FastifyReply> {
        const { barcode, name, orderReferenceDays } = request.body as { barcode: string; name: string; orderReferenceDays: number; };

        const result =this.createProductUseCase.execute(barcode, name, orderReferenceDays);

        if (result instanceof Product) {
            return response.status(201).send({
                barcode: result.getBarcode(),
                name: result.getName(),
                quantityInStock: result.getQuantityInStock(),
                orderReferenceDays: result.getOrderReferenceDays()
            });
        }
        return response.status(400).send({ message: result.message });
    }     
}

