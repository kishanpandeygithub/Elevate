import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";

// Same schema as in ProblemCreate (lowercase languages for consistency with backend)
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case is required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case is required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All 3 languages are required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All 3 languages are required"),
});

const AdminUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: "array",
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "c++", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "javascript", completeCode: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  // Fetch problem data on mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        const prob = response.data;

        // Transform startCode and referenceSolution to match schema (languages are already lowercase in your DB)
        // Ensure arrays exist and have exactly 3 languages (if missing, fill with empty)
        const startCodeMap = {};
        prob.startCode?.forEach((sc) => {
          startCodeMap[sc.language] = sc.initialCode;
        });
        const referenceMap = {};
        prob.referenceSolution?.forEach((rs) => {
          referenceMap[rs.language] = rs.completeCode;
        });

        const startCodeArray = ["c++", "java", "javascript"].map((lang) => ({
          language: lang,
          initialCode: startCodeMap[lang] || "",
        }));
        const referenceArray = ["c++", "java", "javascript"].map((lang) => ({
          language: lang,
          completeCode: referenceMap[lang] || "",
        }));

        // Reset form with fetched data
        reset({
          title: prob.title || "",
          description: prob.description || "",
          difficulty: prob.difficulty || "easy",
          tags: prob.tags || "array",
          visibleTestCases: prob.visibleTestCases || [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: prob.hiddenTestCases || [{ input: "", output: "" }],
          startCode: startCodeArray,
          referenceSolution: referenceArray,
        });
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load problem. Please check the ID or try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProblem();
    else setFetchError("No problem ID provided.");
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.patch(`/problem/update/${id}`, data);
      alert("Problem updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(`Update failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{fetchError}</p>
        <button onClick={() => navigate("/admin")} className="btn btn-outline btn-error">
          Go Back
        </button>
      </div>
    );
  }

  // Language display names for UI
  const langDisplay = {
    "c++": "C++",
    java: "Java",
    javascript: "JavaScript",
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700">
            <h1 className="text-2xl font-bold text-white">Update Problem</h1>
            <p className="text-orange-100 mt-1">Edit the problem details below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-orange-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description <span className="text-orange-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  placeholder="Describe the problem in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-orange-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Difficulty <span className="text-orange-500">*</span>
                  </label>
                  <select
                    {...register("difficulty")}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-orange-400">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tag <span className="text-orange-500">*</span>
                  </label>
                  <select
                    {...register("tags")}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                  {errors.tags && (
                    <p className="mt-1 text-sm text-orange-400">{errors.tags.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Visible Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-gray-700 pb-2">
                <h2 className="text-xl font-semibold text-orange-400">Visible Test Cases</h2>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                  className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  + Add Test Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div key={field.id} className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-300">Test Case {index + 1}</h3>
                    {visibleFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="text-orange-400 hover:text-orange-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Input</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.input`)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                      placeholder="Enter test case input"
                    />
                    {errors.visibleTestCases?.[index]?.input && (
                      <p className="mt-1 text-sm text-orange-400">
                        {errors.visibleTestCases[index].input.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.output`)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                      placeholder="Enter expected output"
                    />
                    {errors.visibleTestCases?.[index]?.output && (
                      <p className="mt-1 text-sm text-orange-400">
                        {errors.visibleTestCases[index].output.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Explanation</label>
                    <input
                      {...register(`visibleTestCases.${index}.explanation`)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="Explain the test case"
                    />
                    {errors.visibleTestCases?.[index]?.explanation && (
                      <p className="mt-1 text-sm text-orange-400">
                        {errors.visibleTestCases[index].explanation.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {errors.visibleTestCases?.message && (
                <p className="text-sm text-orange-400">{errors.visibleTestCases.message}</p>
              )}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-gray-700 pb-2">
                <h2 className="text-xl font-semibold text-orange-400">Hidden Test Cases</h2>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: "", output: "" })}
                  className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  + Add Test Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-300">Hidden Test Case {index + 1}</h3>
                    {hiddenFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="text-orange-400 hover:text-orange-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Input</label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.input`)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                      placeholder="Enter hidden test case input"
                    />
                    {errors.hiddenTestCases?.[index]?.input && (
                      <p className="mt-1 text-sm text-orange-400">
                        {errors.hiddenTestCases[index].input.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.output`)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                      placeholder="Enter expected output"
                    />
                    {errors.hiddenTestCases?.[index]?.output && (
                      <p className="mt-1 text-sm text-orange-400">
                        {errors.hiddenTestCases[index].output.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {errors.hiddenTestCases?.message && (
                <p className="text-sm text-orange-400">{errors.hiddenTestCases.message}</p>
              )}
            </div>

            {/* Code Templates (Start Code) */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">
                Code Templates (Start Code)
              </h2>
              {["c++", "java", "javascript"].map((lang, idx) => (
                <div key={lang} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <h3 className="font-medium text-gray-300 mb-2">{langDisplay[lang]}</h3>
                  <textarea
                    {...register(`startCode.${idx}.initialCode`)}
                    rows={8}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                    placeholder={`Write the initial code template for ${langDisplay[lang]}...`}
                  />
                  {errors.startCode?.[idx]?.initialCode && (
                    <p className="mt-1 text-sm text-orange-400">
                      {errors.startCode[idx].initialCode.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Reference Solutions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">
                Reference Solutions
              </h2>
              {["c++", "java", "javascript"].map((lang, idx) => (
                <div key={lang} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <h3 className="font-medium text-gray-300 mb-2">{langDisplay[lang]}</h3>
                  <textarea
                    {...register(`referenceSolution.${idx}.completeCode`)}
                    rows={10}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white"
                    placeholder={`Write the complete solution for ${langDisplay[lang]}...`}
                  />
                  {errors.referenceSolution?.[idx]?.completeCode && (
                    <p className="mt-1 text-sm text-orange-400">
                      {errors.referenceSolution[idx].completeCode.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Problem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdate;