import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../Hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import PollCard from "../../components/PollCards/PollCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../../context/UserContext.jsx";
import EmptyCard from "../../components/cards/EmptyCard.jsx";

const PAGE_SIZE = 3;

function MyPolls() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading || !user?._id) return; // avoid running before user is loaded

    setLoading(true);

    try {
      const url = `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`;
      console.log("Fetching polls from:", url);

      const response = await axiosInstance.get(url);
      console.log("API response:", response.data.message);

      if (response.data.message?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.message.polls
            : [...prevPolls, ...response.data.message.polls]
        );
        setStats(response.data.message?.stats || []);
        setHasMore(response.data.message.polls.length === PAGE_SIZE);
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
      fetchAllPolls(1);
    }
  }, [filterType, user]);

  useEffect(() => {
    if (page !== 1 && user?._id) {
      fetchAllPolls();
    }
  }, [page, user]);

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            message="Welcome! There are no polls yet, start by creating a poll"
            btnText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
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
          {allPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options || []}
              voters={poll.voters || []}
              responses={poll.responses || []}
              creatorProfileImg={poll.creator?.avatar || null}
              creatorName={poll.creator?.Name}
              creatorEmail={poll.creator?.email}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
}

export default MyPolls;
