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
  tagTypes: ['Orders', 'ShipperOrder'],
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
      invalidatesTags: ['Orders', 'ShipperOrder'],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            updatedCount: response.updatedCount,
            failedCount: response.failedCount || 0,
            failedUpdates: response.failedUpdates || [],
            message: response.message || 'Orders updated successfully',
            results: response.results || []
          };
        }
        throw new Error(response.message || 'Failed to update orders');
      },
      transformErrorResponse: (response) => {
        // Xử lý trường hợp shipper chưa cập nhật đủ thông tin
        if (response.status === 400 && response.data?.missingFields) {
          return {
            success: false,
            status: response.status,
            data: response.data,
            message: response.data.message || 'Vui lòng cập nhật đầy đủ thông tin shipper',
            missingFields: response.data.missingFields,
            isProfileIncomplete: true
          };
        }
        return {
          success: false,
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Failed to update orders',
        };
      },
    }),

    updateShipperOrder: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append('orderId', data.orderId);
        formData.append('status', data.status);
        
        if (data.note) formData.append('note', data.note);
        if (data.images && data.images.length > 0) {
          data.images.forEach((image) => {
            formData.append('images', image);
          });
        }

        return {
          url: '/api/orders/shipper/ordersStatus',
          method: 'PUT',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        };
      },
      invalidatesTags: ['Orders', 'ShipperOrder'],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            message: response.message,
            data: {
              order: response.data.order,
              shipperOrder: response.data.shipperOrder
            }
          };
        }
        throw new Error(response.message || 'Failed to update order status');
      },
      transformErrorResponse: (response) => {
        if (response.status === 400 && response.data?.missingFields) {
          return {
            success: false,
            status: response.status,
            data: response.data,
            message: response.data.message || 'Vui lòng cập nhật đầy đủ thông tin shipper',
            missingFields: response.data.missingFields,
            isProfileIncomplete: true
          };
        }
        return {
          success: false,
          status: response.status,
          data: response.data,
          message: response.data?.message || 'Failed to update order status',
        };
      },
    }),
  }),
});

export const { 
  useGetAvailableOrdersQuery,
  useGetOrdersByShipperQuery,
  useCreateOrderStatusShipperMutation,
  useUpdateShipperOrderMutation,
} = orderApi;