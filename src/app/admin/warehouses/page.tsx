'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { columns } from './_compenents/columns';
import { useQuery } from '@tanstack/react-query';
import { getAllWarehouses } from '@/http/api';
import { Loader2 } from 'lucide-react';
import { useNewWarehouse } from '@/store/warehouse/warehouse-store';
import { DataTable } from '../_components/data-table';
import WarehouseSheet from './_compenents/warehouse-sheet';
import { Warehouse } from '@/types';




const WarehousesPage = () => {
    const { onOpen } = useNewWarehouse();

    const {
        data: warehouses,
        isLoading,
        isError,
    } = useQuery<Warehouse[], Error>({
        queryKey: ['warehouses'],
        queryFn: getAllWarehouses,
    });

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">Warehouses</h3>
                <Button size={'sm'} onClick={onOpen}>
                    Add Warehouse
                </Button>
                <WarehouseSheet />
            </div>

            {isError && <span className="text-red-500">Something went wrong.</span>}

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="size-10 animate-spin" />
                </div>
            ) : (
                <DataTable columns={columns} data={ warehouses || []} />
            )}
        </>
    );
};

export default WarehousesPage;