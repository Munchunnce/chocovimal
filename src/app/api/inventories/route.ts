import { db } from "@/lib/db/db";
import { inventories, products, warehouses } from "@/lib/db/schema";
import { inventoruSchema } from "@/lib/validators/inventorySchema";
import { desc, eq } from "drizzle-orm";

// export async function POST(request: Request){
//     const requestData = await request.json();

//     let validatedData;

//     try {
//         validatedData = await inventoruSchema.parse(requestData);
//     } catch (err) {
//         return Response.json({ message: err}, { status: 400 });
//     }

//     try {
//         await db.insert(inventories).values(validatedData);

//         return Response.json({ message: 'OK' }, { status: 201 });
//     } catch (err) {
//         return Response.json({ message: 'Failed to sotre the inventory into the database', err }, { status: 500})
//     }
// }
type PgError = {
    code?: string;
    message?: string;
  };
  export async function POST(request: Request) {
    const requestData = await request.json();
  
    let validatedData;
  
    try {
      validatedData = await inventoruSchema.parse(requestData);
    } catch (err) {
      return Response.json({ message: err }, { status: 400 });
    }
  
    try {
      await db.insert(inventories).values(validatedData);
      return Response.json({ message: 'OK' }, { status: 201 });
    } catch (err) {
      const dbErr = err as PgError;
  
      if (dbErr.code === '23505') {
        return Response.json(
          { message: 'SKU already exists. Please use a different SKU.' },
          { status: 409 }
        );
      }
  
      return Response.json({
        message: 'Failed to store the inventory into the database',
        error: dbErr.message,
      }, { status: 500 });
    }
  }

export async function GET(){
    try {
        const allInventoires = await db
        .select({
            id: inventories.id,
            sku: inventories.sku,
            warehouse: warehouses.name,
            product: products.name,
        })
        .from(inventories)
        .leftJoin(warehouses, eq(inventories.warehouseId, warehouses.id))
        .leftJoin(products, eq(inventories.productId, products.id))
        .orderBy(desc(inventories.id));
        return Response.json(allInventoires)
    } catch (err) {
        return Response.json({ message: 'Failed to fetch inventories', err }, { status: 500 });
    }
}