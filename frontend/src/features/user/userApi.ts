import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import BASE_URL from "../../constants/api";
import {
  ProfileRequest,
  profileResponse,
  UpdateUsernameRequest,
  SkillRequest,
  SkillResponse,
  UpdateSkillRequest
} from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
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
    updateUsername: builder.mutation<void, UpdateUsernameRequest>({
      query: (body) => ({
        url: 'api/updateUsername',
        method: 'PUT',
        body,
      }),
    }),
    getProfile: builder.query<profileResponse, void>({
      query: () => 'api/profile'
    }),
    createProfile: builder.mutation<void, ProfileRequest>({
      query: (body) => ({
        url: 'api/profile',
        method: 'POST',
        body,
      }),
    }),
    updateProfile: builder.mutation<void, ProfileRequest>({
      query: (body) => ({
        url: 'api/profile',
        method: 'PUT',
        body,
      }),
    }),
    getSkills: builder.query<SkillResponse[], void>({
      query: () => 'api/skill'
    }),
    createSkill: builder.mutation<void, SkillRequest>({
      query: (body) => ({
        url: 'api/skill',
        method: 'POST',
        body,
      }),
    }),
    updateSkill: builder.mutation<void, UpdateSkillRequest>({
      query: ({ id, ...body }) => ({
        url: `api/skill/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteSkill: builder.mutation<void, UpdateSkillRequest>({
      query: ({ id, ...body }) => ({
        url: `api/skill/${id}`,
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useUpdateUsernameMutation,
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = userApi;
