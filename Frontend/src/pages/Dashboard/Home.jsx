import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../Hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import PollCard from "../../components/PollCards/PollCard.jsx";

const PAGE_SIZE = 10;

function Home() {
  useUserAuth();

  const navigate = useNavigate();
  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const url = `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`;
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
          title="Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <p className="text-gray-500">No polls found</p>
        )}

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
      </div>
    </DashboardLayout>
  );
}

export default Home;
