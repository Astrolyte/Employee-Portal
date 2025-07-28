import React from 'react'

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl,setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {};

    const handleRemoveImage = () => {};

    const onChooseFile = () => {

    }
  return (
    <div className='flex justify-center mb-6'>
        <input type="file"
                accept='image/*'
                ref = {inputRef}
                onChange={handleImageChange}
                className='hidden'
        />

        <div className=''>
            <button type = "button" className='' onClick={onChooseFile}>
                
            </button>
        </div>
    </div>
  )
}

export default ProfilePhotoSelector