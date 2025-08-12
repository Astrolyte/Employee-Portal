import React, { useCallback, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import PollingResultContent from "./PollingResultContent.jsx";
const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorEmail,
  userHasVoted,
  isPollClosed,
  createdAt,
}) => {
  const { user, onUserVoted } = useContext(UserContext);
  const [selectOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");

  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });
  const [pollclosed, setPollClosed] = useState(isPollClosed || false);
  const [polldeleted, setpollDeleted] = useState(false);
  const isMyPoll = user?.email === creatorEmail;

  //handles user input based on the poll type
  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };
  //generates post data basde on the poll type
  const getPostData = useCallback(() => {
    if (type === "open-ended") {
      return { responseText: userResponse, voterId: user._id };
    }
    if (type === "rating") {
      return { optionIndex: rating - 1, voterId: user._id };
    }
    return { optionIndex: selectOptionIndex, voterId: user._id };
  }, [type, userResponse, rating, selectOptionIndex, user]);

  //get poll details by ID
  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );
      if (response.data) {
        const polldetails = response.data.message;
        setPollResult({
          options: polldetails.options || [],
          voters: polldetails.voters.length || [],
          responses: polldetails.responses || [],
        });
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error submitting the vote"
      );
    }
  };

  //handels the submission of voters
  const handleVoteSubmit = async () => {
    try {
      await axiosInstance.post(API_PATHS.POLLS.VOTE(pollId), getPostData());

      getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success("Vote Submitted Successfully!");
    } catch (error) {
      console.error(error.response?.data?.message || "Error Submitting Vote");
    }
  };

  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

      if(response.data){
        setPollClosed(true);
        toast.success(response.data?.message || "Poll Clsoed Successfully");
      }

    }catch(error){
      toast.error("Something went wrong. Please try again.");
      console.log("Something went wrong. Please try again",error);
    }
  }
  return (
    !polldeleted && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 mx-4">
        <div className="flex items-start justify-between mb-4">
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullname={creatorName}
            email={creatorEmail}
            createdAt={createdAt}
          />
          <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={!!(userResponse || selectOptionIndex >= 0 || rating)}
            onVoteSubmit={handleVoteSubmit}
            isMyPoll={isMyPoll}
            pollClosed={pollclosed}
            onClosePoll={closePoll}
            onDelete={() => {}}
          />
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-900 mb-2"> {question}</p>
          <div className="text-gray-700 text-sm leading-relaxed">
            {isVoteComplete || isPollClosed ? (
             <PollingResultContent 
             type ={type}
             options = {pollResult.options || []}
             voters = {pollResult.voters}
             responses = {pollResult.responses || [] } />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
