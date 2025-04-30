// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';

// const DashboardPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-gray-100 min-h-screen w-full">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-6 my-14">Dashboard</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//           {/* Crowd Counting Card */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-2xl font-semibold mb-4">Crowd Counting</h2>
//             <p className="text-gray-600 mb-6">
//               Access the crowd counting module using AI-based surveillance.
//             </p>
//             <button
//               onClick={() => navigate('/crowd-counting')}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
//             >
//               Go to Crowd Counting
//             </button>
//           </div>

//           {/* Criminal Detection Card */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-2xl font-semibold mb-4">Criminal Detection</h2>
//             <p className="text-gray-600 mb-6">
//               Navigate to the criminal detection component to monitor suspicious activities.
//             </p>
//             <button
//               onClick={() => navigate('/criminal-detection')}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
//             >
//               Go to Criminal Detection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Dashboard Heading */}
        <h1 className="text-5xl font-bold text-center mb-16 mt-10 p-5 text-gray-800">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Crowd Counting Card */}
          <div 
            onClick={() => navigate('/crowd-counting')}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-3xl font-semibold mb-4 text-blue-700">Crowd Counting</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Access the crowd counting module using AI-based surveillance technology.
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/crowd-counting'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Go to Crowd Counting
            </button>
          </div>

          {/* Criminal Detection Card */}
          <div 
            onClick={() => navigate('/criminal-detection')}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-3xl font-semibold mb-4 text-red-700">Criminal Detection</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Navigate to the criminal detection system and monitor suspicious activities with live AI models.
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/criminal-detection'); }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Go to Criminal Detection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
