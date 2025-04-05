import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../utils/baseUrl';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/shippers`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().shipper?.token || localStorage.getItem('shipperToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result?.error) {
    const errorCode = result.error.data?.code;
    const errorMessages = {
      EMAIL_EXISTS: 'Email đã tồn tại cho shipper',
      USERNAME_EXISTS: 'Username đã tồn tại cho shipper',
      SHIPPER_NOT_FOUND: 'Tài khoản shipper không tồn tại',
      INVALID_PASSWORD: 'Mật khẩu không chính xác',
      TOKEN_EXPIRED: 'Phiên đăng nhập hết hạn',
      INVALID_TOKEN: 'Token không hợp lệ',
      ACCESS_DENIED: 'Truy cập bị từ chối'
    };
    
    if (errorMessages[errorCode]) {
      result.error.data.message = errorMessages[errorCode];
    }
    
    if (result.error.status === 401) {
      localStorage.removeItem('shipperToken');
      window.location.href = '/login?sessionExpired=true';
    }
  }
  
  return result;
};

export const shipperApi = createApi({
  reducerPath: 'shipperApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Shipper'],
  endpoints: (builder) => ({
    registerShipper: builder.mutation({
      query: (shipperData) => ({
        url: '/register',
        method: 'POST',
        body: shipperData,
      }),
      transformResponse: (response) => {
        if (response?.data?.token) {
          localStorage.setItem('shipperToken', response.data.token);
        }
        return response;
      },
      transformErrorResponse: (response) => ({
        status: response.status,
        data: {
          code: response.data?.code,
          message: response.data?.message || 'Đăng ký shipper thất bại'
        }
      })
    }),
    loginShipper: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response?.data?.token) {
          localStorage.setItem('shipperToken', response.data.token);
        }
        return response;
      },
      transformErrorResponse: (response) => ({
        status: response.status,
        data: {
          code: response.data?.code,
          message: response.data?.message || 'Đăng nhập shipper thất bại'
        }
      })
    }),
    logoutShipper: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      transformResponse: () => {
        localStorage.removeItem('shipperToken');
        return { success: true, message: 'Đăng xuất thành công' };
      },
    }),
    getShipperProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Shipper'],
      transformErrorResponse: (response) => ({
        status: response.status,
        data: {
          code: response.data?.code,
          message: response.data?.message || 'Lấy thông tin shipper thất bại'
        }
      })
    }),
  }),
});

export const {
  useRegisterShipperMutation,
  useLoginShipperMutation,
  useLogoutShipperMutation,
  useGetShipperProfileQuery,
} = shipperApi;