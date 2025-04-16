import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInventory } from '@/http/api';
import { useToast } from '@/hooks/use-toast';
import { InventoryData } from '@/types';
import { useNewInventory } from '@/store/inventory/inventory-store';
import CreateInventoryForm, { FormValues } from './create-inventory-form';


const InventorySheet = () => {
    const { toast } = useToast();

    const { isOpen, onClose } = useNewInventory();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ['create-inventory'],
        mutationFn: (data: InventoryData) => createInventory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            toast({
                title: 'Inventory created successfully',
            });
            onClose();
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message ||
                'Something went wrong. Please try again.';
    
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        },
    });

    const onSubmit = (values: FormValues) => {
        mutate(values);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>Create Delivery Person</SheetTitle>
                    <SheetDescription>Create a new delivery person</SheetDescription>
                </SheetHeader>
                <CreateInventoryForm onSubmit={onSubmit} disabled={isPending} />
            </SheetContent>
        </Sheet>
    );
};

export default InventorySheet;
