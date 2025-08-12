import React, { useState } from "react";

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete
}) => {

    const [loading,setLoading] = useState(false);

    const handleVoteClick = async() => {
        setLoading(true);
        try{
            await onVoteSubmit();
        }finally{
            setLoading(true);
        }
    }
  return (
  <div className="flex items-center gap-4">
    {(isVoteComplete || pollClosed)&&(
        <div className="text-[11px] font-medium text-slate-100 bg-sky-600 px-3 py-1 rounded-md">
            {pollClosed ? "Closed" : "Voted"}    
        </div>
    )}
    {
        isMyPoll && !pollClosed && (
            <button className="text-[11px] font-medium text-slate-100 bg-sky-600 px-3 py-1 rounded-md pointer cursor-pointer" onClick={onClosePoll} disabled={loading}>Close</button>
        )
    }
    {
        inputCaptured && !isVoteComplete && (
            <button className="ml-auto bg-sky-600 hover:bg-sky-700 text-white text-sm px-3 py-1 rounded-md transition" onClick={handleVoteClick} disabled ={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>
        )
    }
  </div>
  )
};

export default PollActions;
