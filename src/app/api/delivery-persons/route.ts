import { db } from "@/lib/db/db";
import { deliveryPersion, warehouses } from "@/lib/db/schema";
import { deliveryPersonSchema } from "@/lib/validators/deliveryPersonSchema";
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request){
    const requestData = await request.json()

    let validatedData;

    try {
        validatedData = await deliveryPersonSchema.parse(requestData);
    } catch (err) {
        return Response.json({ message: err}, { status:400 });
    }

    try {
        await db.insert(deliveryPersion).values(validatedData);
        return Response.json({ message: 'OK'}, {status: 201});
    } catch (err) {
        return Response.json({ message: 'Failed to store the delivery person into the database', err}, { status: 500});
    }
};

export async function GET(){
    try {
        const allDeliveryPerson = await db
        .select({
            id: deliveryPersion.id,
            name: deliveryPersion.name,
            phone: deliveryPersion.phone,
            warehouse: warehouses.name,
        })
        .from(deliveryPersion)
        .leftJoin(warehouses, eq(deliveryPersion.warehouseId, warehouses.id))
        .orderBy(desc(deliveryPersion.id));

        return Response.json(allDeliveryPerson);
    } catch (err) {
        return Response.json({ message: 'Failed to fetch delivery person', err}, { status: 500})
    }
}