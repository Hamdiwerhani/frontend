import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/User";

export const loginUser = createAsyncThunk<
    { user: User; token: string },
    { email: string; password: string }
>(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5005/auth/login", data);
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to login");
            }
            return rejectWithValue("Failed to login");
        }
    }
);

export const registerUser = createAsyncThunk<
    { user: User; token: string },
    { name: string; email: string; password: string }
>(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5005/auth/signup", data);
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to register");
            }
            return rejectWithValue("Failed to register");
        }
    }
);


interface AuthState {
    user: User | null;
    token: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
        },
        clearAuthError(state) {
            state.error = null;
        },
        setAuthFromStorage(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.status = "succeeded";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = "succeeded";
                state.error = null;
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = "succeeded";
                state.error = null;
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", action.payload.token);
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearAuthError, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;