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
  const [pollsExhausted, setPollsExhausted] = useState(false);
  const [ideasExhausted, setIdeasExhausted] = useState(false);

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  }

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const requests = [];
      
      // Only fetch polls if not exhausted
      if (!pollsExhausted || overridePage === 1) {
        const pollUrl = `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`;
        console.log("Fetching polls from:", pollUrl);
        requests.push(axiosInstance.get(pollUrl));
      } else {
        requests.push(null);
      }

      // Only fetch ideas if not exhausted
      if (!ideasExhausted || overridePage === 1) {
        const ideaUrl = `${API_PATHS.IDEAS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}`;
        console.log("Fetching ideas from:", ideaUrl);
        requests.push(axiosInstance.get(ideaUrl));
      } else {
        requests.push(null);
      }

      const responses = await Promise.allSettled(requests);
      const [pollResponse, ideaResponse] = responses;

      let polls = [];
      let ideas = [];

      // Process poll response
      if (pollResponse && pollResponse.status === 'fulfilled' && pollResponse.value) {
        console.log("Poll API response:", pollResponse.value.data.message);
        polls = pollResponse.value.data.message?.polls?.map(poll => ({
          ...poll,
          _type: 'poll'
        })) || [];
        
        // Check if polls are exhausted
        const pollData = pollResponse.value.data.message;
        if (polls.length < PAGE_SIZE || overridePage >= pollData.totalPages) {
          setPollsExhausted(true);
        }
      }

      // Process idea response
      if (ideaResponse && ideaResponse.status === 'fulfilled' && ideaResponse.value) {
        console.log("Idea API response:", ideaResponse.value.data.message);
        ideas = ideaResponse.value.data.message?.ideas?.map(idea => ({
          ...idea,
          _type: 'idea'
        })) || [];
        
        // Check if ideas are exhausted
        const ideaData = ideaResponse.value.data.message;
        if (ideas.length < PAGE_SIZE || overridePage >= ideaData.totalPages) {
          setIdeasExhausted(true);
        }
      }

      // Combine and sort by creation date
      const combined = [...polls, ...ideas].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (overridePage === 1) {
        setAllPolls(polls);
        setAllIdeas(ideas);
        setFeedItems(combined);
        setStats(pollResponse?.value?.data?.message?.stats || []);
        // Reset exhaustion states for new filter
        setPollsExhausted(false);
        setIdeasExhausted(false);
      } else {
        if (combined.length > 0) {
          setAllPolls(prev => [...prev, ...polls]);
          setAllIdeas(prev => [...prev, ...ideas]);
          setFeedItems(prev => [...prev, ...combined]);
        }
      }

      // Set hasMore based on whether any source still has content
      setHasMore(!pollsExhausted || !ideasExhausted);

    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setPollsExhausted(false);
    setIdeasExhausted(false);
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
          dataLength={feedItems.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="text-sm text-black-900 font-medium text-center p-3">Loading...</h4>}
          endMessage={<p className="text-sm text-blue-900 font-medium text-center p-3">Nothing More to display.</p>}
        >
          {/* <p>Feed length: {feedItems.length}</p> */}
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