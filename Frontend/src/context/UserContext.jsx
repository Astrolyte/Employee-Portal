import React, {Children, createContext,useState} from "react";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user,setUser] = useState(null);

    const updateUser = (userData) => {
        setUser(userData);
    }

    const clearUser = () => {
        setUser(null);
    }
    //update user stats
    const updateUserStats = (key,value)=>{
        setUser((prev) => ({
            ...prev,
            [key]: value,
        }))
        console.log(user);
    }
    //update totalPollsVoyes count locally
    const onUserVoted = () => {
        
        const totalPollsVotes = user.totalPollsVotes || 0;
        updateUserStats(
            "totalPollsVotes",totalPollsVotes + 1
        )
    }

    //update totalpollscreated count locally
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollsCreated = user?.totalPollsCreated || 0;
        updateUserStats(
            "totalPollsCreated",
            type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
        );
    }
    //update totalIdeasCreated count locally
    const onIdeaCreateOrDelete = (type = "create") => {
        const totalIdeasCreated = user?.totalIdeasCreated || 0;
        updateUserStats(
            "totalIdeasCreated",
            type == "create" ? totalIdeasCreated + 1 : totalIdeasCreated - 1
        );
    }

    //update totalIdeasLiked count locally (when user likes/unlikes an idea)
    const onUserLikedIdea = () => {
        const totalIdeasVotes = user?.totalIdeasVoted || 0;
        // updateUserStats(
        //     "totalIdeasVoted",
        //     type == "like" ? totalIdeasVoted + 1 : totalIdeasVoted - 1
        // );
        updateUserStats("totalIdeasVoted",totalIdeasVotes + 1);
    }
    const onUnlikeIdea = () => {
        const totalIdeasVotes = user?.totalIdeasVoted || 0;
        updateUserStats("totalIdeasVoted",Math.max(totalIdeasVotes - 1,0));
    }
    return (
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            onPollCreateOrDelete,
            onUserVoted,
            onIdeaCreateOrDelete,
            onUserLikedIdea,
            onUnlikeIdea
            }}
            >
                {children}
            </UserContext.Provider>
    )
}
export default UserProvider;