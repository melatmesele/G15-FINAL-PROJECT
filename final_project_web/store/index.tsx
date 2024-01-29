import { configureStore } from "@reduxjs/toolkit";
import { reducer as formReducer } from 'redux-form';
import { useDispatch } from 'react-redux';
import signupTeacherReducer from './signup/signupSliceReducerTeacher';
import signupStudentReducer from './signup/SignupSliceReducerStudent';
import signinStudentReducer from "./signin/student-signin-slice"
import questionUploadReducer from "./question-upload/question-upload-slice"
import { getQuestionDetalApi } from "./question/get-questionById-api";
import { getAllQuestionApi } from "./question/get-all-questions";
import { getAllSubmissionsByIdApi } from "./submissions/get-all-submissions-by-id";
export const store = configureStore({
  reducer: {
    form: formReducer,
    register:signupTeacherReducer, signupStudentReducer,
    studentsignin:signinStudentReducer,
questionupload:questionUploadReducer,
    [getQuestionDetalApi.reducerPath]: getQuestionDetalApi.reducer,
    [getAllQuestionApi.reducerPath]: getAllQuestionApi.reducer,
    [getAllSubmissionsByIdApi.reducerPath]: getAllSubmissionsByIdApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  .concat(getQuestionDetalApi.middleware)
  .concat(getAllQuestionApi.middleware)
  .concat(getAllSubmissionsByIdApi.middleware)
  ,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
