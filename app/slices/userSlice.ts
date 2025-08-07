import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/User";

export const fetchUsers = createAsyncThunk<User[], string>(
    "user/fetchAll",
    async (token, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:5005/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
            }
            return rejectWithValue("Failed to fetch users");
        }
    }
);

export const fetchUserById = createAsyncThunk<User, { id: string; token: string }>(
    "user/fetchById",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5005/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
            }
            return rejectWithValue("Failed to fetch user");
        }
    })

export const searchUsers = createAsyncThunk<User[], { query: string; token: string }>(
    "user/search",
    async ({ query, token }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5005/users?search=${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to search users");
            }
            return rejectWithValue("Failed to search users");
        }
    }
);

export const createUser = createAsyncThunk<User, { data: Partial<User>; token: string }>(
    "user/create",
    async ({ data, token }, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5005/users", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to create user");
            }
            return rejectWithValue("Failed to create user");
        }
    })

export const updateUser = createAsyncThunk<User, { id: string; data: Partial<User>; token: string }>(
    "user/update",
    async ({ id, data, token }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`http://localhost:5005/users/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to update user");
            }
            return rejectWithValue("Failed to update user");
        }
    })

export const deleteUser = createAsyncThunk<string, { id: string; token: string }>(
    "user/delete",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5005/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to delete user");
            }
            return rejectWithValue("Failed to delete user");
        }
    })

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [] as User[],
        user: null as User | null,
        status: "idle",
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map((u) => (u._id === action.payload._id ? action.payload : u));
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u._id !== action.payload);
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;