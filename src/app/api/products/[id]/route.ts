// import { db } from '@/lib/db/db';
// import { products } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//     const id = params.id;

//     try {
//         const product = await db
//             .select()
//             .from(products)
//             .where(eq(products.id, Number(id)))
//             .limit(1);

//         if (!product.length) {
//             return Response.json({ message: 'Product not found.' }, { status: 400 });
//         }

//         return Response.json(product[0]);
//     } catch (err) {
//         return Response.json({ message: 'Failed to fetch a product', err }, { status: 500 });
//     }
// }


import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);

    if (!product.length) {
      return new Response(JSON.stringify({ message: 'Product not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error fetching product', error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
