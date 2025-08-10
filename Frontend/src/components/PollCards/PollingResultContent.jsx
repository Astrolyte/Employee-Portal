import React from "react";

const PollOptionVoteResult = ({label,optionVotes,totalVotes}) =>{
    const progress = totalVotes>0 ?Math.round((optionVotes / totalVotes)*100) : 0;
    return (
        <div className="w-full bg-slate-200/80 rounded-md h-6 relative mb-3">
            <div className="bg-sky-900/100 h-6 rounded-md" style ={{width: `${progress}`}}></div>
            <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4 ">
                {label}<span className="text-[11px] text-slate-500">{progress}%</span>
            </span>
        </div>
    )
}

const ImagePollResult = ()

const PollingResultContent = ({ type, options, voters, responses }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <>
          {options.map((option, index) => (
            <PollOptionVoteResult
              key={option._id}
              label={`${option.optionText} ${type === "rating" ? "Star" : ""}`}
              optionVotes={option.votes}
              totalVotes={voters || 0}
            />
          ))}
        </>
      );

      case "image-based":
        return (
            <div className="grid grid-cols-2 gap-4">
                {options.map((option,index)=>(
                    <ImagePollResult key = {option._id}
                        imgUrl ={option.imageUrl || ""}
                        optionVotes = {option.votes}
                        totalVotes = {voters || 0}
                    />
                ))}
            </div>
        )

        default:
            return null;
  }
  return <div>PollingResultContent</div>;
};

export default PollingResultContent;
