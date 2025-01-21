import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaListUl, FaThLarge } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';


interface Section {
  title: string;
  color: string;
}


function Home() {
  const location = useLocation();
  const { displayName, photoURL } = location.state || {};
  let userId = Cookies.get('jwt');
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId]);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    navigate('/login');
  }
  return (
    <div className="min-h-screen bg-white">

      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <img src="task buddy logo.png" alt="logo" className="w-5 h-5" />
          <h1 className="text-xl font-bold">TaskBuddy</h1>
          <div className="flex gap-2">

          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img
              src={photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-3 font-medium font-bold text-gray-600 text-sm">{displayName}</span>

          </div>
        </div>

      </header>
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
            className="px-10 py-2 text-white rounded-full text-xs hover:bg-[#5E1470]"
            style={{ backgroundColor: "#7B1984" }}
          >
            ADD TASK
          </button>
        </div>
      </div>


      <main className="p-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">

            <div
              className="flex justify-between items-center p-2 rounded-md text-black cursor-pointer"
              style={{ backgroundColor: section.color }}
              onClick={() => toggleSection(section.title)}
            >
              <span>{section.title} (3)</span>
              <span className="relative">
                <div
                  className={`w-3 h-3 border-t-2 border-r-2 transform ${openSections.includes(section.title) ? "rotate-180" : "-rotate-45"
                    }`}
                  style={{
                    borderColor: "black",
                    transformOrigin: "center",
                  }}
                ></div>
              </span>
            </div>


            {openSections.includes(section.title) && (
              <div
                className="flex justify-center items-center p-4 border border-gray-300 rounded-md mt-2"
                style={{ height: "376px", backgroundColor: "#F1F1F1" }}
              >
                <div className="text-center text-black">
                  No Tasks in {section.title}
                </div>
              </div>

            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default Home
