import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../Hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import PollCard from "../../components/PollCards/PollCard.jsx";
import IdeaCard from "../../components/cards/IdeaCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component"
const PAGE_SIZE = 3;
function Home() {
  useUserAuth();

  const navigate = useNavigate();
  const [allPolls, setAllPolls] = useState([]);
  const [allIdeas, setAllIdeas] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const loadMorePolls = ()=>{
    setPage((prevPage)=>prevPage+1);
  }

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const pollUrl = `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`;
      const ideaUrl = `${API_PATHS.IDEAS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}`;
      
      console.log("Fetching polls from:", pollUrl);
      console.log("Fetching ideas from:", ideaUrl);

      const [pollResponse, ideaResponse] = await Promise.all([
        axiosInstance.get(pollUrl),
        axiosInstance.get(ideaUrl)
      ]);

      console.log("Poll API response:", pollResponse.data.message);
      console.log("Idea API response:", ideaResponse.data.message);

      const polls = pollResponse.data.message?.polls?.map(poll => ({
        ...poll,
        _type: 'poll'
      })) || [];

      const ideas = ideaResponse.data.message?.ideas?.map(idea => ({
        ...idea,
        _type: 'idea'
      })) || [];

      // Combine and sort by creation date
      const combined = [...polls, ...ideas].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (overridePage === 1) {
        setAllPolls(pollResponse.data.message?.polls || []);
        setAllIdeas(ideaResponse.data.message?.ideas || []);
        setFeedItems(combined);
        setStats(pollResponse.data.message?.stats || []);
        setHasMore(combined.length === PAGE_SIZE * 2);
      } else {
        if (combined.length > 0) {
          setAllPolls(prev => [...prev, ...(pollResponse.data.message?.polls || [])]);
          setAllIdeas(prev => [...prev, ...(ideaResponse.data.message?.ideas || [])]);
          setFeedItems(prev => [...prev, ...combined]);
          setHasMore(combined.length === PAGE_SIZE * 2);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="Feed"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {feedItems.length === 0 && !loading && (
          <p className="text-gray-500">No content found</p>
        )}
          {/* Infinite scrolling pagination */}
          <InfiniteScroll 
          dataLength = {feedItems.length}
          next = {loadMorePolls}
          hasMore = {hasMore}
          loader = {<h4 className="text-sm text-black-900 font-medium text-center p-3">Loading...</h4>}
          endMessage = {<p className="text-sm text-blue-900 font-medium text-center p-3">Nothing More to display.</p>}
        >

        {feedItems.map((item) =>
          item._type === 'poll' ? (
            <PollCard
              key={`dashboard_${item._id}`}
              pollId={item._id}
              question={item.question}
              type={item.type}
              options={item.options || []}
              voters={item.voters || []}
              responses={item.responses || []}
              creatorProfileImg={item.creator?.avatar || null}
              creatorName={item.creator?.Name}
              creatorEmail={item.creator?.email}
              userHasVoted={item.userHasVoted || false}
              isPollClosed={item.closed || false}
              createdAt={item.createdAt}
            />
          ) : (
            <IdeaCard
              key={`dashboard_${item._id}`}
              ideaId={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              priority={item.priority}
              attachments={item.attachments || []}
              likes={item.likes || []}
              comments={item.comments || []}
              creatorProfileImg={item.creator?.avatar || null}
              creatorName={item.creator?.Name}
              creatorEmail={item.creator?.email}
              userHasLiked={item.userHasLiked || false}
              isAnonymous={item.isAnonymous || false}
              createdAt={item.createdAt}
            />
          )
        )}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
}

export default Home;