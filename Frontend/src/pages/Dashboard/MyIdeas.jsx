import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../Hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import IdeaCard from "../../components/cards/IdeaCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../../context/UserContext.jsx";
import EmptyCard from "../../components/cards/EmptyCard.jsx";

const PAGE_SIZE = 10;

function MyIdeas() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allIdeas, setAllIdeas] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const loadMoreIdeas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllIdeas = async (overridePage = page) => {
    if (loading || !user?._id) return;

    setLoading(true);

    try {
      const url = `${API_PATHS.IDEAS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&status=${filterStatus}&creatorId=${user._id}`;
      console.log("Fetching ideas from:", url);

      const response = await axiosInstance.get(url);
      console.log("API response:", response.data.message);

      if (response.data.message?.ideas?.length > 0) {
        setAllIdeas((prevIdeas) =>
          overridePage === 1
            ? response.data.message.ideas
            : [...prevIdeas, ...response.data.message.ideas]
        );
        setStats(response.data.message?.stats || []);
        setHasMore(response.data.message.ideas.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      setPage(1);
      fetchAllIdeas(1);
    }
  }, [filterStatus, user]);

  useEffect(() => {
    if (page !== 1 && user?._id) {
      fetchAllIdeas();
    }
  }, [page, user]);

  return (
    <DashboardLayout activeMenu="My Ideas">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="My Ideas"
          filterType={filterStatus}
          setFilterType={setFilterStatus}
          filterOptions={[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Under Review", value: "under-review" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
            { label: "Implemented", value: "implemented" },
          ]}
        />

        {allIdeas.length === 0 && !loading && (
          <EmptyCard
            message="Welcome! You haven't created any ideas yet, start by creating an idea"
            btnText="Create Idea"
            onClick={() => navigate("/create-idea")}
          />
        )}

        <InfiniteScroll
          dataLength={allIdeas.length}
          next={loadMoreIdeas}
          hasMore={hasMore}
          loader={
            <h4 className="text-sm text-black font-medium text-center p-3">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-sm text-black font-medium text-center p-3">
              Nothing More to display.
            </p>
          }
        >
          {allIdeas.map((idea) => (
            <IdeaCard
              key={`my_ideas_${idea._id}`}
              ideaId={idea._id}
              title={idea.title}
              description={idea.description}
              status={idea.status}
              priority={idea.priority}
              attachments={idea.attachments || []}
              likes={idea.likes || []}
              comments={idea.comments || []}
              creatorProfileImg={idea.creator?.avatar || null}
              creatorName={idea.creator?.Name}
              creatorEmail={idea.creator?.email}
              userHasLiked={idea.userHasLiked || false}
              isAnonymous={idea.isAnonymous || false}
              createdAt={idea.createdAt}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
}

export default MyIdeas;