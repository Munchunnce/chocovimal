import { z } from "zod";


export const inventoruSchema = z.object({
    sku: z.string({ message: 'SKU should be a string.' }).length(8, 'SKU should be 8 char long'),
    warehouseId: z.number({ message: 'warehouse id sholud be a number' }),
    productId: z.number({ message: 'Product Id should be a number' }),
})