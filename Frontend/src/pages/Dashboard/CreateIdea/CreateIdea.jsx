import React, { useContext, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserContext } from "../../../context/UserContext";
import useUserAuth from "../../../Hooks/useUserAuth";
import { PRIORITY_LEVELS } from "../../../utils/data";
import uploadImage from "../../../utils/uploadImage.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { API_PATHS } from "../../../utils/apiPaths.js";

function CreateIdea() {
  useUserAuth();
  const { user, onIdeaCreateOrDelete } = useContext(UserContext);
  const [ideaData, setIdeaData] = useState({
    title: "",
    description: "",
    priority: "medium",
    isAnonymous: false,
    attachments: [],
    error: "",
  });

  const handleValueChange = (key, value) => {
    setIdeaData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearData = () => {
    setIdeaData({
      title: "",
      description: "",
      priority: "medium",
      isAnonymous: false,
      attachments: [],
      error: "",
    });
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const uploadResponse = await uploadImage(file);
        return {
          fileName: file.name,
          fileUrl: uploadResponse.message.url || "",
        };
      } catch (error) {
        toast.error(`Error uploading ${file.name}`);
        return null;
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    const validFiles = uploadedFiles.filter(file => file !== null);
    
    setIdeaData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setIdeaData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Creating a new idea
  const handleCreateIdea = async () => {
    const { title, description, priority, isAnonymous, attachments } = ideaData;

    if (!title || !description) {
      handleValueChange("error", "Title and description are required");
      return;
    }

    handleValueChange("error", "");

    try {
      const response = await axiosInstance.post(API_PATHS.IDEAS.CREATE, {
        title,
        description,
        priority,
        isAnonymous,
        attachments,
      });

      if (response) {
        toast.success("Idea created successfully");
        onIdeaCreateOrDelete();
        clearData();
      }
    } catch (error) {
      console.error("Idea creation error:", error);
      const errorMsg = error?.response?.data?.message || "Something went wrong, please try again";
      handleValueChange("error", errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <DashboardLayout activeMenu={"Create Idea"}>
      <div className="max-w-4xl bg-gray-100/80 my-5 p-5 rounded-lg py-6 mx-5">
        <h2 className="text-lg text-black font-semibold">Create Idea</h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter your idea title..."
            className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 
                  rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200
                  placeholder-gray-500"
            value={ideaData.title}
            onChange={({ target }) => handleValueChange("title", target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe your idea in detail..."
            className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 
                  rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200
                  resize-none placeholder-gray-500"
            rows={6}
            value={ideaData.description}
            onChange={({ target }) => handleValueChange("description", target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mt-3 mb-3">
            PRIORITY LEVEL
          </label>
          <div className="flex gap-4 flex-wrap mt-3">
            {PRIORITY_LEVELS.map((item) => (
              <div
                key={item.value}
                className={`text-xs font-semibold text-sky-700 bg-sky-100 px-4 py-1 rounded-lg border border-sky-50 cursor-pointer hover:border-blue-700 ${
                  ideaData.priority === item.value
                    ? "text-black bg-sky-50 border-sky-600"
                    : "border-sky-100"
                }`}
                onClick={() => handleValueChange("priority", item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Attachments
          </label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 
                  rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          
          {ideaData.attachments.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Uploaded Files:</p>
              {ideaData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-2">
                  <span className="text-xs text-gray-700">{file.fileName}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={ideaData.isAnonymous}
              onChange={(e) => handleValueChange("isAnonymous", e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Submit anonymously</span>
          </label>
        </div>

        {ideaData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {ideaData.error}
          </p>
        )}

        <button
          className="flex items-center gap-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-sky-200/60 hover:text-blue-500 text-nowrap px-3 py-[4px]"
          onClick={handleCreateIdea}
        >
          Create Idea
        </button>
      </div>
    </DashboardLayout>
  );
}

export default CreateIdea;