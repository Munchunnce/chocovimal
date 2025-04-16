import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Product, Warehouse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts, getAllWarehouses } from '@/http/api';
import { inventoruSchema } from '@/lib/validators/inventorySchema';

export type FormValues = z.input<typeof inventoruSchema>;

const CreateInventoryForm = ({
    onSubmit,
    disabled,
}: {
    onSubmit: (formValus: FormValues) => void;
    disabled: boolean;
}) => {
    const form = useForm<z.infer<typeof inventoruSchema>>({
        resolver: zodResolver(inventoruSchema),
        defaultValues: {
            sku: '',
        },
    });

    const {
        data: warehouses,
        isLoading: isWarehouseLoading,
    } = useQuery<Warehouse[]>({
        queryKey: ['warehouses'],
        queryFn: () => getAllWarehouses(),
    });

    const {
        data: products,
        isLoading: isProductLoading
    } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getAllProducts,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. CH23456" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="warehouseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Warehouse ID</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value ? field.value.toString() : ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Warehouse ID" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isWarehouseLoading ? (
                                        <SelectItem value="Loading">Loading...</SelectItem>
                                    ) : (
                                        <>
                                            {warehouses &&
                                                warehouses.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id ? item.id?.toString() : ''}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product ID</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value ? field.value.toString() : ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Product ID" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isProductLoading ? (
                                        <SelectItem value="Loading">Loading...</SelectItem>
                                    ) : (
                                        <>
                                            {products &&
                                                products.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id ? item.id?.toString() : ''}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" disabled={disabled}>
                    {disabled ? <Loader2 className="size-4 animate-spin" /> : 'Create'}
                </Button>
            </form>
        </Form>
    );
};

export default CreateInventoryForm;