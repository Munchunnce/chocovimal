// import { db } from "@/lib/db/db";
// import { products } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

// export async function GET(request: Response, {params}: {params: {id: string } }){
//     const id = params.id;

//     try {
//         const product = await db.select().from(products).where(eq(products.id, Number(id))).limit(1);
//         if(!product.length){
//             return Response.json({ message: 'Product not found.'}, { status: 400 });
//         }

//         return Response.json(product[0]);
//     } catch  {
//         return Response.json({ message: 'Failed to fetch a product' }, { status: 500 });
//     }
    
// }

import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server"; // ✅ optional but useful for better typing

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;

    try {
        const product = await db.select().from(products).where(eq(products.id, Number(id))).limit(1);
        if (!product.length) {
            return new Response(JSON.stringify({ message: 'Product not found.' }), { status: 400 });
        }

        return new Response(JSON.stringify(product[0]), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ message: 'Failed to fetch a product' }), { status: 500 });
    }
}
