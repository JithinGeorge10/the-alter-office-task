import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import {
  FaSort,
  FaThLarge,
  FaSearch,
  FaBars,
  FaCheckCircle,
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { addTask, changeStatus, fetchTasks } from "../services/taskService";


interface Section {
  title: string;
  color: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  category: string;
  position: number;
  userId: string;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
}


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
  const [taskName, setTaskName] = useState('')
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const maxLength = 3000;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    if (!storedUserId) return;
    (async () => {
      const response = await fetchTasks(storedUserId);
      setTasks(response);
      setOriginalTasks(response)
    })();
  }, [storedUserId]);




  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchKey = e.target.value;
    console.log(searchKey)
    setSearchText(searchKey);

    if (searchKey.trim() === '') {
      setTasks(originalTasks);
    } else {
      const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchKey.toLowerCase())
      );
      setTasks(filteredTasks);
    }
  };

  const handleFilterCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterKey = e.target.value;
    if (!filterKey || filterKey === 'Category') {
      return;
    }
    if (filterKey === 'clearfilter') {
      setTasks(originalTasks);
    } else {
      const filteredTasks = originalTasks.filter(task =>
        task.category.toLowerCase() === filterKey.toLowerCase()
      );
      console.log(filteredTasks);
      setTasks(filteredTasks);
    }
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




  const toggleSection = (sectionTitle: string) => {
    console.log("Toggling section: ", sectionTitle);
    console.log("Current open sections: ", openSections);
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(sectionTitle)
        ? prevOpenSections.filter((title) => title !== sectionTitle)
        : [...prevOpenSections, sectionTitle]
    );
  };


  const sections: Section[] = [
    { title: "todo", color: "#FAC3FF" },
    { title: "inprogress", color: "#85D9F1" },
    { title: "completed", color: "#CEFFCC" },
  ];

  const dummyTasks: Task[] = tasks

  const filterTasksByStatus = (status: string) => {
    return dummyTasks.filter(task => task.status === status);
  }
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
      const newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId)
      console.log(newTaskResponse)
      setTasks((prevTasks) => {
        if (newTaskResponse && newTaskResponse.data.task) {
          const newTask = newTaskResponse.data.task as Task;
          return [...prevTasks, newTask];
        }
        console.error("Invalid task response", newTaskResponse);
        return prevTasks;
      });

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

  const handleStatusChange = (e: any, _id: string) => {

    (async () => {
      const status = e.target.value
      const userId = _id
      const response = await changeStatus(status, userId);
      console.log(response)
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
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">Create Task</h2>
                <button onClick={closeModal} className="text-gray-600">
                  <FaTimes className="text-2xl" />
                </button>
              </div>
              <div className="border-b border-gray-300 w-full my-2"></div>
              <div className="mt-4">
                <input
                  type="text"
                  onChange={handleTaskName}
                  placeholder="Task Title"
                  className="w-full border rounded p-2 mb-2"
                />
                <div className="relative w-full border rounded p-2 h-40 mb-2">
                  <textarea
                    placeholder="Description"
                    className="w-full h-full p-2 resize-none focus:outline-none"
                    value={text}
                    onChange={handleChange}
                    maxLength={maxLength}
                  ></textarea>
                  <div className="absolute bottom-2 left-2 flex gap-4 text-gray-500">
                    <FaBold />
                    <FaItalic />
                    <FaListOl />
                    <FaListUl />
                  </div>
                  <span className="absolute bottom-2 right-2 text-gray-500 text-sm">
                    {text.length}/{maxLength} characters
                  </span>
                </div>

                <div className="flex flex-wrap justify-between mb-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Task Category*</span>
                    <div className="flex items-start gap-1">
                      <button
                        onClick={handleCategory}
                        value="work"
                        className={`px-4 py-1 border rounded-full ${category === "work"
                          ? "bg-blue-500 text-white"
                          : "bg-transparent text-black"
                          }`}
                      >
                        Work
                      </button>
                      <button
                        onClick={handleCategory}
                        value="personal"
                        className={`px-4 py-1 border rounded-full ${category === "personal"
                          ? "bg-blue-500 text-white"
                          : "bg-transparent text-black"
                          }`}
                      >
                        Personal
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Due on*</span>
                    <input
                      onChange={handleDate}
                      type="date"
                      className="border rounded p-1"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">Task Status*</span>
                    <select
                      onChange={handleStatus}
                      className="border rounded p-1 text-gray-700"
                    >
                      <option value="" disabled selected>
                        Choose
                      </option>
                      <option value="todo">Todo</option>
                      <option value="inprogress">In-Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-700">Attachment</span>
                  <div
                    className="w-full h-10 border-2 border-gray-500 bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      const fileInput = document.getElementById("fileInput");
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="text-gray-500">
                      Drop your files here or update
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 text-sm bg-gray-200 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 text-sm text-white rounded-full"
                    style={{ backgroundColor: "#7B1984" }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mx-4 border-b border-gray-300"></div>
        <div className="flex mx-4 mb-0 text-gray-500">
          <span className="font-bold w-1/5">Task</span>
          <span className="font-bold flex items-center w-2/5 justify-center">
            Due
            <FaSort className="ml-2 text-gray-500" />
          </span>
          <span className="font-bold w-1/5  text-center">Status</span>
          <span className="font-bold w-1/5  text-center">Category</span>
          <span className="font-bold w-1/5"></span>
        </div>
        <main className="p-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <div
                className="flex justify-between items-center p-2 rounded-md text-black cursor-pointer"
                style={{ backgroundColor: section.color }}
                onClick={() => toggleSection(section.title)}
              >
                <span>
                  {section.title} ({filterTasksByStatus(section.title).length})
                </span>
                <div
                  className={`w-3 h-3 border-t-2 border-r-2 transform ${openSections.includes(section.title)
                    ? "rotate-180"
                    : "-rotate-45"
                    }`}
                  style={{ borderColor: "black" }}
                ></div>
              </div>

              {openSections.includes(section.title) && (
                <div className="flex flex-col items-start p-4 border border-gray-300 rounded-md mt-2 bg-gray-100">
                  <div className="w-full">
                    {filterTasksByStatus(section.title).length === 0 ? (
                      <div className="text-center text-black">
                        No Tasks in {section.title}
                      </div>
                    ) : (
                      <table className="w-full">
                        <tbody>
                          {filterTasksByStatus(section.title).map((task, index) => {

                            const taskDate = new Date(task.dueDate);
                            const today = new Date();
                            const isToday =
                              taskDate.toDateString() === today.toDateString();
                            const formattedDate = isToday
                              ? "Today"
                              : new Intl.DateTimeFormat("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }).format(taskDate);

                            return (
                              <tr key={index} className="border-b border-gray-300">
                                <td className="py-3 px-3 flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    readOnly

                                  />
                                  <FaBars className="mr-2" />
                                  <FaCheckCircle
                                    className={`mr-2 ${task.status === "completed"
                                      ? "text-green-500"
                                      : "text-gray-400"
                                      }`}
                                  />
                                  <span
                                    className={`${task.status === "completed"
                                      ? "line-through text-black-500"
                                      : ""
                                      }`}
                                  >
                                    {task.title}
                                  </span>
                                </td>
                                <td className="py-3 px-3 w-1/4 text-center">
                                  {formattedDate}
                                </td>
                                <td className="py-3 px-3 w-1/4 text-center">
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(e, task._id)}
                                    className="appearance-none bg-gray-300 border rounded-lg py-2 px-4 pr-10"
                                  >
                                    <option value="todo">Todo</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="completed">Complete</option>
                                  </select>


                                </td>
                                <td className="py-3 px-3 w-1/4">{task.category}</td>
                                <td className="text-lg font-bold">...</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}


            </div>
          ))}
        </main>
      </div>
    </>
  );

}

export default Home;


