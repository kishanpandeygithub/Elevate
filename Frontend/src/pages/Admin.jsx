import { useState } from "react";
import { Plus, Edit, Trash2, Home, RefreshCw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import NavBar from "../component/NavBar";
function Admin() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'Create',
      title: 'Create Problem',
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
    {
      id: 'Update',
      title: 'Update Problem',
      description: "Edit existing problems and their details",
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update'
    },
    {
      id: 'Delete',
      title: 'Delete Problem',
      description: "Remove problems from the platform",
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-0 ">
      <NavBar></NavBar>

      {/* Header */}
      <div className="text-center mt-10 mb-10">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage coding problems on your platform</p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.id}
              className={`card bg-black border border-orange-500/20 shadow-lg hover:shadow-orange-500/20 hover:shadow-xl transition-all duration-300 hover:border-orange-500/50 ${option.bgColor} bg-opacity-5`}
            >
              <div className="card-body items-center text-center">
                {/* Icon */}
                <div className={`p-3 rounded-full ${option.bgColor} mb-4`}>
                  <Icon className={`w-8 h-8 ${option.color.replace('btn-', 'text-')}`} />
                </div>
                {/* Title */}
                <h2 className="card-title text-xl text-orange-400">{option.title}</h2>
                {/* Description */}
                <p className="text-gray-400 text-sm mt-2">{option.description}</p>
                {/* Button */}
                <div className="card-actions mt-6">
                  <button
                    onClick={() => handleCardClick(option.route)}
                    className={`btn ${option.color} text-white border-none px-6`}
                  >
                    {option.id} Problem
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;