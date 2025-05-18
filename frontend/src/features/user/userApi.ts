import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import BASE_URL from "../../constants/api";
import {
  ProfileRequest,
  profileResponse,
  SkillRequest,
  SkillResponse,
  UpdateSkillRequest,
  UsernameRequest,
  UsernameResponse,
  WorkResponse
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
    getProfileByUsername: builder.query<profileResponse, string>({
      query: (username) => `public/profile/${username}`,
    }),
    getSkillsByUsername: builder.query<SkillResponse[], string>({
      query: (username) => `public/skill/${username}`,
    }),
    getWorksByUsername: builder.query<WorkResponse[], string>({
      query: (username) => `public/work/${username}`
    }),
    getUsername: builder.query<UsernameResponse, void>({
      query: () => 'api/user/username'
    }),
    updateUsername: builder.mutation<void, UsernameRequest>({
      query: (body) => ({
        url: 'api/user/username',
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
    createWork: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'api/work',
        method: 'POST',
        body: formData,
      }),
    }),
    updateWork: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({id, formData}) => ({
        url: `api/work/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteWork: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/work/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProfileByUsernameQuery,
  useGetSkillsByUsernameQuery,
  useGetWorksByUsernameQuery,
  useGetUsernameQuery,
  useUpdateUsernameMutation,
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} = userApi;
