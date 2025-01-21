import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
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
import { addTask } from "../services/taskService";


interface Section {
  title: string;
  color: string;
}

interface Task {
  taskName: string;
  dueOn: string;
  status: string;
  taskCategory: string;
}

function Home() {
  let userId = Cookies.get('jwt');
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId]);



  const [taskName, setTaskName] = useState('')
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');



  const maxLength = 3000;
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

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (e: any) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };


  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(sectionTitle)
        ? prevOpenSections.filter((title) => title !== sectionTitle)
        : [...prevOpenSections, sectionTitle]
    );
  };


  const sections: Section[] = [
    { title: "Todo", color: "#FAC3FF" },
    { title: "In-Progress", color: "#85D9F1" },
    { title: "Completed", color: "#CEFFCC" },
  ];


  const dummyTasks: Task[] = [
    { taskName: "Task 1", dueOn: "2025-01-25", status: "Todo", taskCategory: "Work" },
    { taskName: "Task 2", dueOn: "2025-01-28", status: "In-Progress", taskCategory: "Personal" },
    { taskName: "Task 3", dueOn: "2025-01-30", status: "Completed", taskCategory: "Work" },
    { taskName: "Task 4", dueOn: "2025-02-05", status: "Todo", taskCategory: "Personal" },
    { taskName: "Task 5", dueOn: "2025-02-10", status: "In-Progress", taskCategory: "Work" },
    { taskName: "Task 6", dueOn: "2025-02-12", status: "Completed", taskCategory: "Personal" },
  ];

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
      if (!taskName || !text || !date || !status || !category) {
        alert("Please fill in all the required fields.");
        return;
      }
      await addTask(taskName,text,date,status,category)
      setTaskName('')
      setText('')
      setFile(null)
      setCategory('')
      setDate('')
      setStatus('')
      setIsModalOpen(false);
    })()

  }
  return (
    <>
      <div className="min-h-screen bg-white">

        <Navbar></Navbar>

        <div className="flex items-center justify-between px-4 py-2 bg-white">
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
            className="flex items-center gap-2 px-4 py-2 text-sm  border rounded-xl hover:bg-gray-100"
            style={{ backgroundColor: "#FFF9F9" }}
          >
            <img src="logout.png" alt="Logout" className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-white mt-2">
          <div className="flex gap-4">
            <h1 className='text-gray-500'>Filter by:</h1>
            <select className="border rounded-full px-3 py-1 text-gray-500">
              <option value="">Category</option>
            </select>
            <select className="border rounded-full px-3 py-1 text-gray-500">
              <option value="">Due Date</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center border-black border rounded-full px-3 py-1">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="focus:outline-none placeholder-black"
              />
            </div>

            <button
              onClick={handleAddTaskClick}
              className="px-10 py-2 text-white rounded-full text-xs hover:bg-[#5E1470]"
              style={{ backgroundColor: "#7B1984" }}
            >
              ADD TASK
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg" style={{
              width: "800px",
              height: "650px",
            }}>
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">Create Task</h2>
                <button onClick={closeModal} className="text-gray-600">
                  <FaTimes className="text-2xl" />
                </button>
              </div>
              <br />
              <div className="border-b border-gray-300 w-full"></div>

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


                <br />
                <div className="flex justify-between mb-2">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-gray-500">Task Category*</span>
                    <div className="flex items-start gap-1">
      <button
        onClick={handleCategory}
        value="work"
        className={`px-4 py-1 border rounded-full ${category === 'work' ? 'bg-blue-500 text-white' : 'bg-transparent text-black'}`}
      >
        Work
      </button>
      <button
        onClick={handleCategory}
        value="personal"
        className={`px-4 py-1 border rounded-full ${category === 'personal' ? 'bg-blue-500 text-white' : 'bg-transparent text-black'}`}
      >
        Personal
      </button>
    </div>
                  </div>


                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-gray-500">Due on*</span>
                    <input onChange={handleDate} type="date" className="border rounded p-1" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-gray-700">Task Status*</span>
                    <select onChange={handleStatus} className="border rounded p-1 text-gray-700">
                      <option value="" disabled selected>Choose</option>
                      <option value="todo">Todo</option>
                      <option value="inprogress">In-Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Attachment</span>
                </div>
                <div
                  className="w-full h-10 border-2  border-gray-500 bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) {
                      fileInput.click(); // Safe to call click()
                    }
                  }}
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <span className="text-gray-500">Drop your files here or update</span>
                </div>

                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="flex justify-end gap-4">
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
        <br />
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
                <span>{section.title} ({filterTasksByStatus(section.title).length})</span>
                <span className="relative">
                  <div
                    className={`w-3 h-3 border-t-2 border-r-2 transform ${openSections.includes(section.title) ? "rotate-180" : "-rotate-45"}`}
                    style={{
                      borderColor: "black",
                      transformOrigin: "center",
                    }}
                  ></div>
                </span>
              </div>

              {openSections.includes(section.title) && (
                <div
                  className="flex flex-col justify-start items-start p-4 border border-gray-300 rounded-md mt-2"
                  style={{ height: "316px", backgroundColor: "#F1F1F1" }}
                >
                  <div className="w-full">
                    {filterTasksByStatus(section.title).length === 0 ? (
                      <div className="text-center text-black">
                        No Tasks in {section.title}
                      </div>
                    ) : (
                      <table className="w-full">
                        <tbody>
                          {filterTasksByStatus(section.title).map((task, index) => (
                            <tr key={index} className="border-b border-gray-300 mb-4">
                              <td className="py-3 px-3 flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <FaBars className="mr-2" />
                                <FaCheckCircle className="text-gray-400 mr-2" />
                                {task.taskName}
                              </td>
                              <td className="py-3 px-3 w-1/4 text-center">{task.dueOn}</td>
                              <td className="py-3 px-3 w-1/4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button className="bg-gray-300 rounded-lg py-2 px-4 text-center max-w-44 mx-auto">
                                    {task.status}
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-3 w-1/4">{task.taskCategory}</td>
                              <td className="text-lg font-bold">...</td>

                            </tr>
                          ))}
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
  )
}

export default Home;


