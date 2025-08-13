import React, { useState, useContext } from "react";
import { FaHeart, FaRegHeart, FaPaperclip, FaCommentAlt } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

function IdeaCard({
  ideaId,
  title,
  description,
  status,
  priority,
  attachments,
  likes,
  comments,
  creatorProfileImg,
  creatorName,
  creatorEmail,
  userHasLiked,
  isAnonymous,
  createdAt,
}) {
  const { user, onUserLikedIdea, onUnlikeIdea } = useContext(UserContext);
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [ideaComments, setIdeaComments] = useState(comments);
  const [loading, setLoading] = useState(false);

  const isMyIdea = user?.email === creatorEmail;

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const endpoint = hasLiked 
        ? `${API_PATHS.IDEAS.UNLIKE}/${ideaId}/unlike`
        : `${API_PATHS.IDEAS.LIKE}/${ideaId}/like`;
      
      const res = await axiosInstance.post(endpoint);
      
    console.log("Like API Response:", res.data);
    setLikeCount(res.data.message.likes.length);
      
    setHasLiked(res.data.message.userHasLiked);
      // Update user stats in context
      if(res.data.message.userHasLiked){
        onUserLikedIdea();
      }else{
        onUnlikeIdea();
      }
      
      toast.success(hasLiked ? "Idea unliked" : "Idea liked");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.IDEAS.ADD_COMMENT}/${ideaId}/comment`,
        { text: newComment }
      );
      const transformedComments = response.data.message.comments.map(comment => ({
      ...comment,
      user: {
        _id: comment.user, // This is the user ID string from backend
        Name: user.Name,   // Use current user's name
        avatar: user.avatar // Use current user's avatar
      }
    }));
    setIdeaComments(transformedComments);
    console.log(transformedComments);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 mx-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {!isAnonymous && (
            <>
              <img
                src={creatorProfileImg || "/default-avatar.png"}
                alt={creatorName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{creatorName}</p>
                <p className="text-sm text-gray-500">{creatorEmail}</p>
              </div>
            </>
          )}
          {isAnonymous && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm">?</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Anonymous</p>
                <p className="text-sm text-gray-500">Hidden identity</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          {isMyIdea && (
            <div className="text-[11px] font-medium text-slate-100 bg-green-600 px-3 py-1 rounded-md">
              My Idea
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaPaperclip className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Attachments</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
              >
                {attachment.fileName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-1 text-sm transition-colors ${
              hasLiked 
                ? "text-red-500" 
                : "text-gray-500 hover:text-red-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaCommentAlt />
            <span>{ideaComments.length}</span>
          </button>
        </div>
        
        <span className="text-xs text-gray-500">
          {formatTime(createdAt)}
        </span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3 mb-4">
            {ideaComments.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <img
                  src={comment.user?.avatar || "/default-avatar.png"}
                  alt={comment.user?.Name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-sm text-gray-900">{comment.user?.Name}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Comment */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              disabled={loading}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeaCard;