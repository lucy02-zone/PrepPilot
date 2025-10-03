export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Note {
    id: number;
    user: {
        id: number;
        username: string;
    };
    title: string;
    subject: string;
    topic: string;
    content: string;
    file: string | null;
    file_type: string;
    file_size: number;
    description: string;
    tags: Tag[];
    votes: number;
    view_count: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    vote_count: number;
    user_vote: number | null;
}