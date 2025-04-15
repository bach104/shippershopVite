import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseUrl";

export const shipperApi = createApi({
  reducerPath: "shipperApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/shippers`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().shipper.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Shipper"],
  endpoints: (builder) => ({
    registerShipper: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
        credentials: "include",
      }),
    }),
    loginShipper: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    logoutShipper: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Shipper"],
    }),
    updateShipper: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Shipper"],
    }),
  }),
});

export const {
  useRegisterShipperMutation,
  useLoginShipperMutation,
  useLogoutShipperMutation,
  useUpdateShipperMutation,
} = shipperApi;

