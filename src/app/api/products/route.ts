import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { productSchema } from "@/lib/validators/productSchema";
import { desc } from "drizzle-orm";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";

 export async function POST(request: Request){
    //todo: check user access
    const data = await request.formData();

    let validatedData;

    try{
        validatedData = productSchema.parse({
            name: data.get('name'),
            description: data.get('description'),
            price: Number(data.get('price')),
            image: data.get('image'),
        })
    }catch(err){
        return Response.json({ message: err}, { status: 400 });
    }

    const fileName = validatedData.image instanceof File
        ? `${Date.now()}.${validatedData.image.name.split('.').slice(-1)}`
        : '';
    if (!fileName) {
        return Response.json({ message: 'Invalid image file' }, { status: 400 });
    }
    
    // image store
    try {
        if (validatedData.image instanceof File) {
            const buffer = Buffer.from(await validatedData.image.arrayBuffer());
            await writeFile(path.join(process.cwd(), 'public/assets', fileName), buffer);
        } else {
            return Response.json({ message: 'Invalid image file' }, { status: 400 });
        }
        // await writeFile(path.join(process.cwd(), 'public/assets', fileName), buffer);
    } catch (err) {
        return Response.json({ message: 'Failed to save the file fs', err }, { status: 500 });
    }

    try {
        await db.insert(products).values({ ...validatedData, image: fileName })
    } catch (err) {
        // Agar database insert fail ho gaya to jo image store ki thi usko delete karein
        await unlink(path.join(process.cwd(), 'public/assets', fileName)).catch(() => {});
        return Response.json({ message: 'Failed to store product into the database', err }, { status: 500 });
    }

    return Response.json({ message: 'OK'}, { status: 201}) // jab bhi kisi rest API ke andar kisi resource ko create krte hai to hum uske andar status 201 return kiya jata hai

 }

 export async function GET(){
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        return Response.json(allProducts);
    } catch (err) {
        return Response.json({ message: 'Failed to fetch products', err }, { status: 500 });
    }
 }

