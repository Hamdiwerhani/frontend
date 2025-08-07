export interface Project {
    _id: string;
    name: string;
    description?: string;
    status: string;
    tags?: string[];
    createdAt?: string;
    owner?: {
        _id: string
        name: string;
        email?: string;
    };
    sharedWith?: Array<{
        _id: string;
        user?: { email?: string };
        permissions: string[];
    }>;
}