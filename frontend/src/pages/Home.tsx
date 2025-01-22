import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import {
  FaThLarge, FaSearch, FaListUl,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Modal from "../components/Modal";
import Board from "../components/Board"; 

function Home() {
  const location = useLocation();
  const { userId } = location.state || {};
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);
  
  const navigate = useNavigate();
  let userToken = Cookies.get('jwt');
  useEffect(() => {
    if (!userToken) {
      navigate('/login');
    }
  }, [userToken]);

  const [filterCategory, setFilterCategory] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [taskDetails, setTaskDetails] = useState({});
  const [activeView, setActiveView] = useState('list'); // New state to track view

  const handleSearchChange = (e:any) => {
    const searchKey = e.target.value;
    setSearchTitle(searchKey);
    setSearchText(searchKey);
  };

  const handleFilterCategory = (e:any) => {
    setFilterCategory(e.target.value);
  };

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white">
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-2 px-3 py-1 ${activeView === 'list' ? 'underline' : ''}`}
              onClick={() => setActiveView('list')} // Set view to "list"
            >
              <FaListUl className="w-5 h-5 text-gray-600" />
              List
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-1 ${activeView === 'board' ? 'underline' : ''}`}
              onClick={() => setActiveView('board')} // Set view to "board"
            >
              <FaThLarge className="w-5 h-5 text-gray-600" />
              Board
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-xl hover:bg-gray-100"
            style={{ backgroundColor: "#FFF9F9" }}
          >
            <img src="logout.png" alt="Logout" className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white mt-2">
          <div className="flex flex-wrap gap-4">
            <h1 className="text-gray-500">Filter by:</h1>
            <select onChange={handleFilterCategory} className="border rounded-full px-3 py-1 text-gray-500">
              <option selected disabled value="">Category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="clearfilter">Clear Filter</option>
            </select>

            <select className="border rounded-full px-3 py-1 text-gray-500">
              <option value="">Due Date</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center border-black border rounded-full px-3 py-1">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="focus:outline-none placeholder-black w-full"
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
            <button
              onClick={handleAddTaskClick}
              className="px-6 md:px-10 py-2 text-white rounded-full text-xs hover:bg-[#5E1470]"
              style={{ backgroundColor: "#7B1984" }}
            >
              ADD TASK
            </button>
          </div>
        </div>

        {isModalOpen && (
          <Modal modalValue={setIsModalOpen} addTaskValue={setTaskDetails} />
        )}
        {activeView === 'list' ? (
          <List categoryValue={filterCategory} searchValue={searchTitle} taskValue={taskDetails} />
        ) : (
          <Board />
        )}
      </div>
    </>
  );
}

export default Home;
