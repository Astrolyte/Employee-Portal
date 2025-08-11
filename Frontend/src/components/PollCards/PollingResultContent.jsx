import React from "react";

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  // Handle totalVotes as either array length or number
  const totalVoteCount = Array.isArray(totalVotes) ? totalVotes.length : (totalVotes || 0);
  const progress = totalVoteCount > 0 ? Math.round((optionVotes / totalVoteCount) * 100) : 0;
  
  return (
    <div className="w-full bg-slate-200/60 rounded-lg h-8 relative mb-4 shadow-sm">
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-700 h-8 rounded-lg transition-all duration-500 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[13px] font-medium px-4">
        <span className="truncate flex-1 mr-2">{label}</span>
        <span className="text-[12px] text-slate-600 font-semibold flex items-center gap-1">
          <span className="bg-white/80 px-2 py-0.5 rounded-full">{optionVotes}</span>
          <span>({progress}%)</span>
        </span>
      </span>
    </div>
  );
};

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  // Handle totalVotes as either array length or number
  const totalVoteCount = Array.isArray(totalVotes) ? totalVotes.length : (totalVotes || 0);
  const progress = totalVoteCount > 0 ? Math.round((optionVotes / totalVoteCount) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img src={imgUrl} alt="poll option" className="w-full h-32 object-contain" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
          {optionVotes} votes
        </div>
      </div>
      <div className="p-3">
        <div className="w-full bg-slate-200/60 rounded-full h-3 relative">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-gray-700">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

const PollingResultContent = ({ type, options, voters, responses }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Poll Results</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Array.isArray(voters) ? voters.length : (voters || 0)} total votes
            </span>
          </div>
          {options.map((option, index) => (
            <PollOptionVoteResult
              key={option._id || index}
              label={option.optionText || `Option ${index + 1}`}
              optionVotes={option.votes || 0}
              totalVotes={voters || 0}
            />
          ))}
        </div>
      );

    case "rating":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Rating Results</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Array.isArray(voters) ? voters.length : (voters || 0)} total ratings
            </span>
          </div>
          {options.map((option, index) => (
            <PollOptionVoteResult
              key={option._id || index}
              label={`${index + 1} Star${index !== 0 ? 's' : ''}`}
              optionVotes={option.votes || 0}
              totalVotes={voters || 0}
            />
          ))}
        </div>
      );

    case "image-based":
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Poll Results</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Array.isArray(voters) ? voters.length : (voters || 0)} total votes
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <ImagePollResult
                key={option._id || index}
                imgUrl={option.imageUrl || ""}
                optionVotes={option.votes || 0}
                totalVotes={voters || 0}
              />
            ))}
          </div>
        </div>
      );

    case "open-ended":
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-700">Responses</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {responses?.length || 0} responses
            </span>
          </div>
          {responses && responses.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {responses.map((response, index) => (
                <div
                  key={response._id || index}
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3">
                    
                    <img
                      src={response.voterId?.avatar || "/default-avatar.png"}
                      alt={response.voterId?.Name || "User"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {response.voterId?.Name || "Anonymous User"}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {response.createdAt ? new Date(response.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ""}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {response.responseText || "No response provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No responses yet.</p>
              <p className="text-gray-400 text-xs mt-1">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default PollingResultContent;