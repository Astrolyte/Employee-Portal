export const BASE_URL = 'http://localhost:8000'

//utils/apiPaths.js
export const API_PATHS= {
    AUTH:{
        LOGIN: "api/v1/users/login",
        REGISTER: "api/v1/users/register",
        CURRENT_USER: "api/v1/users/current-user"
    },
    POLLS:{
        CREATE:"api/v1/poll/create",
        GET_ALL: "api/v1/poll/getAllPolls",
        GET_BY_ID: (pollId) => `api/v1/poll/${pollId}`,
        VOTE: (pollId) => `api/v1/poll/${pollId}/vote`,
        CLOSE: (pollId) => `api/v1/poll/${pollId}/close`,
        VOTED_POLLS: "api/v1/poll/votedPolls",
        DELETE: (pollId) => `api/v1/poll/${pollId}/delete`
    },
    IMAGE:{
        UPLOAD: "/api/v1/image-upload/upload",
    }
};