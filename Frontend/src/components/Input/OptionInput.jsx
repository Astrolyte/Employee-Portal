import React, { useState } from 'react'
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2';

const OptionInput = ({optionList,setOptionList}) => {
    const [option,setOption] = useState("");

    const handleAddOption = () => {
        if(option.trim() && optionList.length<4){
            setOptionList([...optionList,option.trim()]);
            setOption("");
        }
    };
    const handleDeleteOption = (index) => {
        const updatedArr = optionList.filter((_,idx)=>idx !==index);
        setOptionList(updatedArr);
    }
  return (
    <div>
        {optionList.map((item,index)=>(
            <div key={item} className='flex justify-between bg-gray-200/80 px-4 py-2 rounded-md mb-3'>
            <p className='text-xs font-medium text-black'>{item}</p>

            <button onClick={
                () => {
                    handleDeleteOption(index);
                }
            }>
                <HiOutlineTrash className='text-lg text-red-500'/>
            </button>
        </div>
        ))}
        {optionList.length<4 && (
            <div className='flex items-center gap-5 mt-4'>
            <input 
            type = "text"
            placeholder='Enter Option'
            value = {option}
            onChange={({target})=>setOption(target.value)}
            className='w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md '
            />
            <button className='flex items-center gap-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-sky-200/60 hover:text-blue-500 text-nowrap px-3 py-[4px]' onClick={handleAddOption}>
                <HiMiniPlus className="text-lg" /> Add Option
            </button>
            </div>
        )}
    </div>
  )
}

export default OptionInput