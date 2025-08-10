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

    return (
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            onPollCreateOrDelete,
            onUserVoted
            }}
            >
                {children}
            </UserContext.Provider>
    )
}
export default UserProvider;