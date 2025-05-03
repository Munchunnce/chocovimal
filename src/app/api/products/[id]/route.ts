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

export async function GET(request: NextRequest) {
  // Extracting id from the URL path
  const urlPath = request.nextUrl.pathname.split('/');
  const id = urlPath[urlPath.length - 1];

  if (!id) {
    return new Response(
      JSON.stringify({ message: 'Product ID is missing in the URL.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id))) // Ensuring id is converted to number
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
