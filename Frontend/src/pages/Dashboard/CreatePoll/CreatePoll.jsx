import React, { useContext, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserContext } from "../../../context/UserContext";
import useUserAuth from "../../../Hooks/useUserAuth";
import { POLL_TYPE } from "../../../utils/data";
import OptionInput from "../../../components/Input/OptionInput.jsx";
import OptionImageSelector from "../../../components/Input/OptionImageSelector.jsx";

function CreatePoll() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOptions: [],

    error: "",
  });
  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Creating a new poll
  const handleCreatePoll = async () => {
    const {question ,type ,options , error} = pollData;

    if(!question ||!type){
      console.log("CREATE: ",{question,type,options,error});
      handleValueChange("error","Questions and type are required");
      return;
    }
    if(type === "single-choice" && options.length < 2){
      handleValueChange("error","Enter atleast two options");
      return ;
    }
    if(type === "image-based" && options.length < 2){
      handleValueChange("error","Enter atleast two options");
      return ;
    }
    handleValueChange("error","");
    console.log("NO_ERR",{pollData});
  }

  return (
    <DashboardLayout activeMenu={"Create Poll"}>
      <div className="max-w-4xl bg-gray-100/80 my-5 p-5 rounded-lg py-6 mx-5">
        <h2 className="text-lg text-black font-semibold">Create Poll</h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Question
          </label>
          <textarea
            placeholder="What's on your mind...?"
            className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 
                  rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200
                  resize-none placeholder-gray-500"
            rows={4}
            value={pollData.question}
            onChange={({ target }) =>
              handleValueChange("question", target.value)
            }
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mt-3 mb-3">
            POLL TYPE
          </label>
          <div className="flex gap-4 flex-wrap mt-3">
            {POLL_TYPE.map((item) => (
              <div
                key={item.value}
                className={`text-xs font-semibold text-sky-700 bg-sky-100 px-4 py-1 rounded-lg border border-sky-50 cursor-pointer hover:border-blue-700 ${
                  pollData.type === item.value
                    ? "text-black bg-sky-50 border-sky-600"
                    : "border-sky-100"
                }`}
                onClick={() => handleValueChange("type", item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              OPTIONS
            </label>
            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => {
                  handleValueChange("options", value);
                }}
              />
            </div>
          </div>
        )}
        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">
              IMAGE OPTIONS
            </label>
            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value) => {
                  handleValueChange("imageOptions", value);
                }}
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">
            {pollData.error}
          </p>
        )}

        <button
          className="flex items-center gap-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-sky-200/60 hover:text-blue-500 text-nowrap px-3 py-[4px]"
          onClick={handleCreatePoll}
        >Create </button>
      </div>
    </DashboardLayout>
  );
}

export default CreatePoll;
