import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";


export async function POST(request: Request){
    // todo: check auth
    const requestData = await request.json();

    let validatedData;

    try {
        validatedData = await warehouseSchema.parse(requestData);
    } catch (err: unknown) {    
        const errorMessage = err instanceof Error ? err.message : "Invalid input";
        return Response.json({ message: errorMessage }, { status: 400 });
    }

    try {
        await db.insert(warehouses).values(validatedData);

        return Response.json({ message: 'OK'}, { status: 201});
    } catch {
        return Response.json({ message: 'Failed to store the warehouse'}, { status: 500});
    }
};

export async function GET(){
    try {
        const allWarehouses = await db.select().from(warehouses);
        return Response.json(allWarehouses); 
    } catch {
        return Response.json({ message: 'Failed to fetch all warehouse' }, { status: 500});
    }
};