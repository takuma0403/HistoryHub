import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import BASE_URL from "../../constants/api";
import type { LoginRequest, AuthResponse, MeResponse, SignupRequest, VerifyRequest } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      }
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<void, SignupRequest>({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
    }),
    verify: builder.mutation<void, VerifyRequest>({
      query: (body) => ({
        url: 'auth/verify',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => 'api/me',
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyMutation,
  useLoginMutation,
  useGetMeQuery,
} = authApi;
