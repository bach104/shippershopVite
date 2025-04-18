import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../utils/baseUrl';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().shipper.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getAvailableOrders: builder.query({
      query: (params) => ({
        url: '/api/orders/shipper/available-orders',
        method: 'GET',
        params: {
          ...params,
          ...(params.startDate && { startDate: new Date(params.startDate).toISOString() }),
          ...(params.endDate && { endDate: new Date(params.endDate).toISOString() }),
        },
      }),
      providesTags: ['Orders'],
      transformResponse: (response) => {
        if (response.success) {
          return response;
        }
        throw new Error(response.message || 'Failed to fetch orders');
      },
    }),
    
    getOrdersByShipper: builder.query({
      query: () => '/api/orders/shipper/orders',
      providesTags: ['Orders'],
      transformResponse: (response) => {
        if (response?.success !== false) {
          return {
            success: true,
            orders: response?.orders || [],
            count: response?.count || 0
          };
        }
        throw new Error(response.message || 'Failed to fetch shipper orders');
      },
    }),
    
    createOrderStatusShipper: builder.mutation({
      query: (orders) => ({
        url: '/api/orders/shipper/status',
        method: 'PUT',
        body: { orders },
      }),
      invalidatesTags: ['Orders'],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            updatedCount: response.updatedCount,
            failedCount: response.failedCount || 0,
            failedUpdates: response.failedUpdates || [],
            message: response.message || 'Orders updated successfully'
          };
        }
        throw new Error(response.message || 'Failed to update orders');
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Failed to update orders',
        };
      },
    }),
  }),
});

export const { 
  useGetAvailableOrdersQuery,
  useGetOrdersByShipperQuery,
  useCreateOrderStatusShipperMutation,
} = orderApi;