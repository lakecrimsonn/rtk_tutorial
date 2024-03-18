import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "0", name: "neymar" },
  { id: "1", name: "mbappe" },
  { id: "2", name: "messi" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
