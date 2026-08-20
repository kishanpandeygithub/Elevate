import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { useState } from "react";

const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().min(1, "Explanation is required")
        })
    ).min(1, "At least one visible test case is required"),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
        })
    ).min(1, "At least one hidden test case is required"),
    startCode: z.array(
        z.object({
            language: z.enum(['cpp', 'java', 'javascript']), // lowercase
            initialCode: z.string().min(1, "Initial code is required"),
        })
    ).length(3, "All 3 languages are required"),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['cpp', 'java', 'javascript']), // lowercase
            completeCode: z.string().min(1, "Complete code is required"),
        })
    ).length(3, "All 3 languages are required")
});

function ProblemCreate() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            tags: "array",
            visibleTestCases: [
                { input: "", output: "", explanation: "" }
            ],
            hiddenTestCases: [
                { input: "", output: "" }
            ],
            startCode: [
                { language: 'cpp', initialCode: '' },
                { language: 'java', initialCode: '' },
                { language: 'javascript', initialCode: '' },
            ],
            referenceSolution: [
                { language: 'cpp', completeCode: '' },
                { language: 'java', completeCode: '' },
                { language: 'javascript', completeCode: '' },
            ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible,
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden,
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await axiosClient.post('/problem/create', data);
            alert("Problem Created Successfully");
            navigate('/');
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
                    <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700">
                        <h1 className="text-2xl font-bold text-white">Create New Problem</h1>
                        <p className="text-orange-100 mt-1">Fill in the details below to create a new coding problem</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Title <span className="text-orange-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("title")}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
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
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
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
                                    className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
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
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                            placeholder="Enter test case input"
                                        />
                                        {errors.visibleTestCases?.[index]?.input && (
                                            <p className="mt-1 text-sm text-orange-400">{errors.visibleTestCases[index].input.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
                                        <textarea
                                            {...register(`visibleTestCases.${index}.output`)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                            placeholder="Enter expected output"
                                        />
                                        {errors.visibleTestCases?.[index]?.output && (
                                            <p className="mt-1 text-sm text-orange-400">{errors.visibleTestCases[index].output.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Explanation</label>
                                        <input
                                            {...register(`visibleTestCases.${index}.explanation`)}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                                            placeholder="Explain the test case"
                                        />
                                        {errors.visibleTestCases?.[index]?.explanation && (
                                            <p className="mt-1 text-sm text-orange-400">{errors.visibleTestCases[index].explanation.message}</p>
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
                                    className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
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
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                            placeholder="Enter hidden test case input"
                                        />
                                        {errors.hiddenTestCases?.[index]?.input && (
                                            <p className="mt-1 text-sm text-orange-400">{errors.hiddenTestCases[index].input.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
                                        <textarea
                                            {...register(`hiddenTestCases.${index}.output`)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                            placeholder="Enter expected output"
                                        />
                                        {errors.hiddenTestCases?.[index]?.output && (
                                            <p className="mt-1 text-sm text-orange-400">{errors.hiddenTestCases[index].output.message}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {errors.hiddenTestCases?.message && (
                                <p className="text-sm text-orange-400">{errors.hiddenTestCases.message}</p>
                            )}
                        </div>

                        {/* Start Code Templates */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">Code Templates (Start Code)</h2>
                            {['cpp', 'java', 'javascript'].map((lang, index) => (
                                <div key={lang} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                                    <h3 className="font-medium text-gray-300 mb-2">{lang}</h3>
                                    <textarea
                                        {...register(`startCode.${index}.initialCode`)}
                                        rows={8}
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                        placeholder={`Write the initial code template for ${lang}...`}
                                    />
                                    {errors.startCode?.[index]?.initialCode && (
                                        <p className="mt-1 text-sm text-orange-400">{errors.startCode[index].initialCode.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Reference Solutions */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-orange-400 border-b-2 border-gray-700 pb-2">Reference Solutions</h2>
                            {['c++', 'java', 'javascript'].map((lang, index) => (
                                <div key={lang} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                                    <h3 className="font-medium text-gray-300 mb-2">{lang}</h3>
                                    <textarea
                                        {...register(`referenceSolution.${index}.completeCode`)}
                                        rows={10}
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm text-white placeholder-gray-500"
                                        placeholder={`Write the complete solution for ${lang}...`}
                                    />
                                    {errors.referenceSolution?.[index]?.completeCode && (
                                        <p className="mt-1 text-sm text-orange-400">{errors.referenceSolution[index].completeCode.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Creating..." : "Create Problem"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProblemCreate;