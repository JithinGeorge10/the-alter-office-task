import { useState } from "react";
interface Section {
  title: string;
  color: string;
}


function Home() {
  const [openSections, setOpenSections] = useState<string[]>([]); // Type the state as an array of strings

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(sectionTitle)
        ? prevOpenSections.filter((title) => title !== sectionTitle) // Close the section
        : [...prevOpenSections, sectionTitle] // Open the section
    );
  };

  const sections: Section[] = [
    { title: "Todo", color: "#FAC3FF" },
    { title: "In-Progress", color: "#85D9F1" },
    { title: "Completed", color: "#CEFFCC" },
  ];
  return (
    <div className="min-h-screen bg-white">

      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">TaskBuddy</h1>
          <div className="flex gap-2">

          </div>
        </div>
        <div className="flex items-center gap-4">

          <div className="flex items-center">
            <span className="mr-2 font-medium">Aravind</span>

          </div>
        </div>
      </header>
      <div className="flex items-center justify-between px-4 py-2 bg-white">
        <div className="flex gap-4">
          <button className="px-3 py-1 hover:bg-gray-100 underline">
            List
          </button>

          <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">
            Board
          </button>

        </div>
        <button className="px-3 py-1  border rounded-xl hover:bg-gray-100" style={{ backgroundColor: "#FFF9F9" }}>
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
        <input
  type="text"
  placeholder="Search"
  className="border rounded-full px-3 py-1 focus:outline-none placeholder-black"
/>

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
                className={`w-3 h-3 border-t-2 border-r-2 transform ${
                  openSections.includes(section.title) ? "rotate-180" : "-rotate-45"
                }`}
                style={{
                  borderColor: "black",
                  transformOrigin: "center",
                }}
              ></div>
            </span>
          </div>

          {/* Task List */}
          {openSections.includes(section.title) && (
            <div
              className="flex justify-center items-center p-4 border border-gray-300 rounded-md mt-2"
              style={{ height: "376px" }} // Set fixed height when open
            >
              <div className="text-center text-gray-500">
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
