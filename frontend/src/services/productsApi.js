import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/products`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ page = 1, size = 10, search = '' } = {}) => {
                let queryString = `?page=${page}&size=${size}`;
                if (search) queryString += `&search=${search}`;
                return queryString;
            },
            providesTags: ['Products'],
        }),
        getRecurringTemplates: builder.query({
            query: () => '/recurring-templates',
        }),
        createProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Products'],
        }),
        getProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
    }),
});

export const { useGetProductsQuery, useCreateProductMutation, useGetRecurringTemplatesQuery, useGetProductByIdQuery } = productsApi;
