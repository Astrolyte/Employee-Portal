import React from "react";
import moment from "moment";
const UserProfileInfo = ({ imgUrl, fullname, email, createdAt }) => {
  return (
    <div className="flex items-centergap-4  ">
        <img
          src={imgUrl}
          alt=""
          className="w-10 h-10 rounded-full border-none"
        />
      <div>
        <p className=" text-sm text-black font-medium leading-4">
          {fullname} <span className="mx-1 text-sm text-slate-500">--</span>
          <span className="text-[10px] mx-1 text-sm text-slate-500">
                {""}
            {createdAt && moment(createdAt).fromNow()}</span>
        </p>
        <span className="text-[11.5px] text-slate-500 leading-4">{email}</span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
