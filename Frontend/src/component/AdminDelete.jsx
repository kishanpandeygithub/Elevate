import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { Trash2, Loader } from "lucide-react";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // track which problem is being deleted

  // Fetch all problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem/getAllProblem");
      setProblems(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return;
    }

    try {
      setDeletingId(id);
      await axiosClient.delete(`/problem/delete/${id}`);
      // Remove the deleted problem from local state
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProblems}
          className="btn btn-outline btn-error text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-2">Delete Problems</h1>
        <p className="text-gray-400">Remove coding problems from the platform</p>
      </div>

      {/* Problems Table */}
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <table className="table w-full bg-black border border-orange-500/20 rounded-lg">
          {/* Table Head */}
          <thead className="bg-orange-500/10">
            <tr className="text-orange-400 border-b border-orange-500/30">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Difficulty</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No problems found.
                </td>
              </tr>
            ) : (
              problems.map((problem, index) => (
                <tr
                  key={problem._id}
                  className="border-b border-orange-500/10 hover:bg-orange-500/5 transition-colors"
                >
                  {/* Serial Number */}
                  <td className="px-4 py-3 text-gray-300">{index + 1}</td>

                  {/* Title */}
                  <td className="px-4 py-3 font-medium text-gray-200">
                    {problem.title}
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        problem.difficulty === "easy"
                          ? "bg-green-600 text-white"
                          : problem.difficulty === "medium"
                          ? "bg-orange-500 text-black"
                          : "bg-red-600 text-white"
                      } border-none px-3 py-1 rounded-full text-xs`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Tags (can be string or array) */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags && Array.isArray(problem.tags) ? (
                        problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs">
                          {problem.tags || "N/A"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(problem._id)}
                      disabled={deletingId === problem._id}
                      className="btn btn-sm btn-error text-white bg-red-600 hover:bg-red-700 border-none gap-1 disabled:opacity-50"
                    >
                      {deletingId === problem._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDelete;