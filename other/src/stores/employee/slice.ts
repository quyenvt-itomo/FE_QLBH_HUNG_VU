import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { EMPLOYEE_MESSAGES } from "../../constants/message/employee";
import { IEmployee, EmployeeQuery, EmployeeResponse } from "../../models/store/employee";

const initialState = createBaseInitialState<IEmployee>();

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    ...createBaseReducers<IEmployee, EmployeeQuery, EmployeeResponse>(EMPLOYEE_MESSAGES),
  },
});

export const {
  getAll,
  getAllSuccess,
  getAllFailure,
  getItem,
  getItemSuccess,
  getItemFailure,
  addItem,
  addItemSuccess,
  addItemFailure,
  updateItem,
  updateItemSuccess,
  updateItemFailure,
  deleteItem,
  deleteItemSuccess,
  deleteItemFailure,
  clearMessage,
  reset,
  resetItem,
  resetNewData,
  resetErrors,
  resetDeletedId,
} = employeeSlice.actions;

export default employeeSlice.reducer;
