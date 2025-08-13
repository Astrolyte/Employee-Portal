import React from "react";

const StatsInfo = ({label,value}) =>{
    return <div className="text-center">
        <p className="font-semibold text-gray-950">{value}</p>
        <p className="text-xs text-slate-700/80 mt-[2px]">{label}</p>
    </div>
}
function UserDetailsCard({
  avatar,
  Name,
  Email,
  totalPollsVotes,
  totalPollsCreated,
  totalIdeasCreated,
  totalIdeasVoted,
}) {
  return (
    <div className="bg-slate-100/50 rounded-lg mt-16 overflow-hidden">
      <div className="w-full h-32 bg-profile bg-cover flex justify-center bg-blue-400 relative">
        <div className="absolute -bottom-10 rounded-full overflow-hidden border-2 border-primary">
          <img
            src={avatar || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>
      </div>
      <div className="mt-12 px-5">
        <div className="text-center pt-1">
            <h5 className="text-lg text-gray-950 font-semibold leading-6">
                {Name}
            </h5>
            <span className="text-[13px] font-medium text-slate-700/60 ">
                {Email}
            </span>
        </div>
        <div className="flex items-center justify-center gap-5 flex-wrap my-6">
            <StatsInfo label ="Polls Created" value={totalPollsCreated || 0} />
            <StatsInfo label ="Polls Voted" value={totalPollsVotes || 0} />
            <StatsInfo label ="Ideas Created" value={totalIdeasCreated || 0} />
            <StatsInfo label ="Ideas Voted" value={totalIdeasVoted} />

        </div>
      </div>
    </div>
  );
}

export default UserDetailsCard;
