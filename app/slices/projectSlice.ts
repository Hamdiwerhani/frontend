import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Project } from "../types/Project";

export const fetchProjects = createAsyncThunk<Project[], string>(
    "project/fetchAll",
    async (token, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:5005/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.data;
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
            }
            return rejectWithValue("Failed to fetch projects");
        }
    }
);

export const fetchProjectById = createAsyncThunk<Project, { id: string; token: string }>(
    "project/fetchById",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5005/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch project");
            }
            return rejectWithValue("Failed to fetch project");
        }

    }
);

export const searchProjects = createAsyncThunk<Project[], { query: string; token: string }>(
    "project/search",
    async ({ query, token }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5005/projects?search=${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to search projects");
            }
            return rejectWithValue("Failed to search projects");
        }
    }
);

export const createProject = createAsyncThunk<Project, { data: Partial<Project>; token: string }>(
    "project/create",
    async ({ data, token }, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5005/projects", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to create project");
            }
            return rejectWithValue("Failed to create project");
        }
    }
);

export const updateProject = createAsyncThunk<Project, { id: string; data: Partial<Project>; token: string }>(
    "project/update",
    async ({ id, data, token }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`http://localhost:5005/projects/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to update project");
            }
            return rejectWithValue("Failed to update project");
        }
    }
);

export const deleteProject = createAsyncThunk<string, { id: string; token: string }>(
    "project/delete",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5005/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to delete project");
            }
            return rejectWithValue("Failed to delete project");
        }
    }
);

export const fetchProjectsByTag = createAsyncThunk<Project[], { tag: string; token: string }>(
    "project/fetchByTag",
    async ({ tag, token }, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `http://localhost:5005/projects/by-tag/${encodeURIComponent(tag)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch projects by tag");
            }
            return rejectWithValue("Failed to fetch projects by tag");
        }
    }
);

export const fetchAllAdminProjects = createAsyncThunk<Project[], string>(
    "project/fetchAllAdmin",
    async (token, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:5005/projects/admin/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch admin projects");
            }
            return rejectWithValue("Failed to fetch admin projects");
        }
    }
);

export const shareProject = createAsyncThunk<
    Project,
    { projectId: string; userId: string; permission: "view" | "edit"; token: string }
>(
    "project/share",
    async ({ projectId, userId, permission, token }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `http://localhost:5005/projects/${projectId}/share`,
                {
                    userId,
                    permissions: [permission],
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || "Failed to share project");
            }
            return rejectWithValue("Failed to share project");
        }
    }
);

export const transferOwnership = createAsyncThunk<
    Project,
    { projectId: string; newOwnerId: string; token: string }
>(
    "project/transferOwnership",
    async ({ projectId, newOwnerId, token }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `http://localhost:5005/projects/${projectId}/transfer-owner`,
                { newOwnerId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(
                    err.response?.data?.message || "Failed to transfer ownership"
                );
            }
            return rejectWithValue("Failed to transfer ownership");
        }
    }
);


const projectSlice = createSlice({
    name: "project",
    initialState: {
        projects: [] as Project[],
        project: null as Project | null,
        status: "idle",
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.project = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(searchProjects.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(searchProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.projects = state.projects.map((p) => (p._id === action.payload._id ? action.payload : p));
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter((p) => p._id !== action.payload);
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            }).addCase(fetchProjectsByTag.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchProjectsByTag.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            }).addCase(fetchAllAdminProjects.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchAllAdminProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            }).addCase(shareProject.fulfilled, (state, action) => {
                state.project = action.payload;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(shareProject.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            }).addCase(transferOwnership.fulfilled, (state, action) => {
                state.project = action.payload;
                state.projects = state.projects.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(transferOwnership.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
    },
});

export default projectSlice.reducer;