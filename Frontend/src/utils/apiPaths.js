export const API_PATHS= {
    AUTH:{
        LOGIN: "/api/v1/users/login",
        REGISTER: "/api/v1/users/register",
        CURRENT_USER: "/api/v1/users/current-user",
        LOGOUT: "/api/v1/users/logout"
    },
    POLLS:{
        CREATE:"/api/v1/poll/create",
        GET_ALL: "/api/v1/poll/getAllPolls",
        GET_BY_ID: (pollId) => `/api/v1/poll/${pollId}`,
        VOTE: (pollId) => `/api/v1/poll/${pollId}/vote`,
        CLOSE: (pollId) => `/api/v1/poll/${pollId}/close`,
        VOTED_POLLS: "/api/v1/poll/votedPolls",
        DELETE: (pollId) => `/api/v1/poll/${pollId}/delete`
    },
    IMAGE:{
        UPLOAD: "/api/v1/image-upload/upload",
    },
    IDEAS: {
        CREATE: "/api/v1/ideas/create",
        GET_ALL: "/api/v1/ideas/getAllIdeas",
        GET_LIKED: "/api/v1/ideas/likedIdeas",
        GET_BY_ID: "/api/v1/ideas",
        LIKE: "/api/v1/ideas",
        UNLIKE: "/api/v1/ideas",
        ADD_COMMENT: "/api/v1/ideas",
        UPDATE_STATUS: "/api/v1/ideas",
        ARCHIVE: "/api/v1/ideas",
        DELETE: "/api/v1/ideas",
    },
};
