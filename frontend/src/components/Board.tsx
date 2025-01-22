
function Board() {
    return (
        <>
            <div className="min-h-screen bg-white px-4 py-6">


                {/* Task Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Todo Column */}
                    <div className="bg-gray-200 rounded-md shadow p-4">
                        <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#FAC3FF' }}>
                            TO-DO
                        </h2>


                        <div className="space-y-4">
                            {/* Task Card */}
                            <div className="bg-white p-4 rounded-md shadow-sm">
                                <h3 className="font-medium text-gray-800">Interview with Design Team</h3>
                                <p className="text-sm text-gray-500">Work • Today</p>
                            </div>

                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-gray-200 rounded-md shadow p-4">
                    <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#85D9F1' }}>
                            IN-PROGRESS
                        </h2>                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-md shadow-sm">
                                <h3 className="font-medium text-gray-800">Morning Workout</h3>
                                <p className="text-sm text-gray-500">Personal • Today</p>
                            </div>

                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="bg-gray-200 rounded-md shadow p-4">
                    <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#CEFFCC' }}>
                            COMPLETED
                        </h2>                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-md shadow-sm">
                                <h3 className="font-medium text-gray-800 line-through">Submit Project Proposal</h3>
                                <p className="text-sm text-gray-500">Work • Today</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Board
