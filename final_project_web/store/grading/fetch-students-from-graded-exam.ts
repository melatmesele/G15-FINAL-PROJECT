import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const jwt = require("jsonwebtoken");
import { URL } from "../host";

const baseUrl = "";

export const fetchStudentsFromGradedExamApi = createApi({
  reducerPath: "fetchStudentsFromGradedExamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchStudentsFromGradedExam: builder.query({
      query: (params) => {
        const {  examId } = params;
        let url = `${URL}/grading/fetchAllGradedStudents`;
        const queryParams = [];

        queryParams.push(`${examId}`);

        return {
          url: queryParams.length > 0 ? `${url}/${queryParams.join("/")}` : url,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useFetchStudentsFromGradedExamQuery } = fetchStudentsFromGradedExamApi;
