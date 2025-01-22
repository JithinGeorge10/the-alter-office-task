import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import {
  FaThLarge, FaSearch, FaBold, FaItalic, FaListOl,
  FaListUl, FaTimes,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Modal from "../components/Modal";

function Home() {
  const location = useLocation();
  const { userId } = location.state || {};
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);
  const storedUserId = localStorage.getItem('userId');


  let userToken = Cookies.get('jwt');
  useEffect(() => {
    if (!userToken) {
      navigate('/login');
    }
  }, [userToken]);

  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [taskName, setTaskName] = useState('')
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const maxLength = 3000;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [taskDetails, setTaskDetails] = useState({}); 


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchKey = e.target.value;
    setSearchTitle(searchKey)
    setSearchText(searchKey)
  };

  const handleFilterCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value)
  };

  const handleChange = (event: any) => {
    if (event.target.value.length <= maxLength) {
      setText(event.target.value);
    }
  };
  const handleCategory = (event: any) => {
    setCategory(event.target.value);
  }

  const handleTaskName = (event: any) => {
    if (event.target.value.length <= maxLength) {
      setTaskName(event.target.value);
    }
  };
  const handleStatus = (event: any) => {
    setStatus(event.target.value);
  };
  const handleDate = (event: any) => {
    setDate(event.target.value)
  }
  const handleFileUpload = (e: any) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };
  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTaskName('')
    setText('')
    setFile(null)
    setCategory('')
    setDate('')
    setStatus('')
    setIsModalOpen(false);
  };


  const handleLogout = () => {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    navigate('/login');
  }

  const handleSubmit = () => {
    (async () => {
      if (!taskName || !text || !date || !status || !category || !storedUserId) {
        alert("Please fill in all the required fields.");
        return;
      }
      setTaskDetails({taskName, text, date, status, category, storedUserId, });
      setTaskName('')
      setText('')
      setFile(null)
      setCategory('')
      setDate('')
      setStatus('')
      setIsModalOpen(false);
      navigate('/')
    })()
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 underline">
              <FaListUl className="w-5 h-5 text-gray-600" />
              List
            </button>
            <button className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:bg-gray-100">
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
          <Modal modalValue={setIsModalOpen} addTaskValue={setTaskDetails}/>
        )}
        <List  categoryValue={filterCategory} searchValue={searchTitle} taskValue={taskDetails}></List>
      </div>
    </>
  );
}

export default Home;