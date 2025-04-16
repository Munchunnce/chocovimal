import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"
import CreateProductForm, { FormValues } from './create-prodect-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/http/api';
import { useNewProduct } from '@/store/product/product-store';
import { useToast } from '@/hooks/use-toast';
  

const ProductSheet = () => {
    const { toast } = useToast();
    const { isOpen, onClsose } = useNewProduct();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ['create-product'],
        mutationFn: (data: FormData) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
              title: "Product created successfully",
            })
            onClsose();
        }
    })

    const onSubmit = (value: FormValues) => {
        console.log(value);
        const formdata = new FormData();
        formdata.append('name', value.name);
        formdata.append('description', value.description);
        formdata.append('price', String(value.price));
        formdata.append('image', (value.image as FileList)[0]);

        mutate(formdata);
    }
  return (
    <Sheet open={isOpen} onOpenChange={onClsose}>
  <SheetContent className='min-w-[28rem] space-y-4'>
    <SheetHeader>
      <SheetTitle>Create Product</SheetTitle>
      <SheetDescription>
        Create a new product
      </SheetDescription>
    </SheetHeader>
    <CreateProductForm onSubmit={onSubmit} disabled={isPending}/>
  </SheetContent>
</Sheet>

  )
}

export default ProductSheet;
