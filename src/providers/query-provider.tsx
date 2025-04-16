'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let borwserQueryClient: QueryClient | undefined = undefined ;

function makeQueryClient() {
    return new QueryClient();
}
function getQueryClient() {
    // we are on server
    if (typeof window === 'undefined') {
        return makeQueryClient();
    } else {
        // we are on client
        if (!borwserQueryClient) {
            borwserQueryClient = makeQueryClient();
        }
        return borwserQueryClient;
    }
}

const queryClient = getQueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}