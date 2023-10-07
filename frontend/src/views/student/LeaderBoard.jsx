import axios from 'axios';
import { useState, useEffect } from 'react';

const LeaderBoard = () => {
  const [rankingData, setRankingData] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loggedInUsername, setLoggedInUsername] = useState(''); // Initialize with an empty string
  const [loading, setLoading] = useState(true);

  // Retrieve the logged-in user's username from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    // Fetch ranking data
    axios
      .get(`http://localhost:8080/api/submissions/rank`)
      .then((res) => {
        setLoading(false);

        // Sort ranking data based on attempts in descending order
        const sortedRanking = res.data.ranking.sort((a, b) => b.attempts - a.attempts);

        // Update usernames for ranking
        const rankingWithUsernames = sortedRanking.map((user, index) => ({
          ...user,
          username: usernames[user.userId] || 'Loading...',
          rank: index + 1, // Calculate rank
        }));

        setRankingData(rankingWithUsernames);

        // Fetch usernames for each user ID
        const userIds = sortedRanking.map((user) => user.userId);
        fetchUsernames(userIds);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [usernames]);

  const fetchUsernames = (userIds) => {
    // Fetch usernames for each user ID and update the state
    userIds.forEach((userId) => {
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((res) => {
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [userId]: res.data.user.name,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h5>Leaderboard</h5>
      <table className="table table-bordered table-hover table-dark" style={{ width: '80%' }}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">Rank</th>
          </tr>
        </thead>
        <tbody>
          {rankingData.map((user, index) => (
            <tr key={user} className={user.username === loggedInUsername ? 'table-success' : ''}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
