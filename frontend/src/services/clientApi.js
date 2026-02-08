import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/clients`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Clients', 'Client', 'Payments'],
    endpoints: (builder) => ({
        getClients: builder.query({
            query: ({ page = 1, size = 10, search = '' }) => ({
                url: '/',
                params: { page, size, search },
            }),
            providesTags: ['Clients'],
        }),
        getClient: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Client', id }],
        }),
        createClient: builder.mutation({
            query: (newClient) => ({
                url: '/',
                method: 'POST',
                body: newClient,
            }),
            invalidatesTags: ['Clients'],
        }),
        updateClient: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => ['Clients', { type: 'Client', id }],
        }),
        deleteClient: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Clients'],
        }),
        // Payments
        getClientPayments: builder.query({
            query: (clientId) => `/${clientId}/payments`,
            providesTags: (result, error, clientId) => [{ type: 'Payments', id: clientId }],
        }),
        recordPayment: builder.mutation({
            query: ({ clientId, ...paymentData }) => ({
                url: `/${clientId}/payments`,
                method: 'POST',
                body: { ...paymentData, client_id: clientId },
            }),
            invalidatesTags: (result, error, { clientId }) => [{ type: 'Payments', id: clientId }],
        }),
        resetClientPassword: builder.mutation({
            query: (id) => ({
                url: `/${id}/reset-password`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetClientsQuery,
    useGetClientQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    useGetClientPaymentsQuery,
    useRecordPaymentMutation,
    useResetClientPasswordMutation,
} = clientApi;
