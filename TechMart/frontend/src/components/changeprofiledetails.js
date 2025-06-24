import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify'; 

const UpdateUserProfile = ({
    name,
    email,
    phoneNumber,
    userId,
    onClose,
    callFunc,
}) => {
    const [updatedName, setUpdatedName] = useState(name);
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(phoneNumber);

    const handleNameChange = (e) => {
        setUpdatedName(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setUpdatedPhoneNumber(e.target.value);
    };

    const updateUserProfile = async() => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                name: updatedName,
                phoneNumber: updatedPhoneNumber
            })
        });

        const responseData = await fetchResponse.json();

        if(responseData.success){
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error("Failed to update profile.");
        }

        console.log("Profile updated:", responseData);
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-200 bg-opacity-50'>
           <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>

                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose/>
                </button>

                <h1 className='pb-4 text-lg font-medium'>Edit User Profile</h1>

                 <p>Email: {email}</p>

                <div className='my-4'>
                    <label className='block text-sm font-semibold mb-1'>Name:</label>
                    <input
                        type="text"
                        value={updatedName}
                        onChange={handleNameChange}
                        className='w-full border px-4 py-2'
                    />
                </div>

                <div className='my-4'>
                    <label className='block text-sm font-semibold mb-1'>Phone Number:</label>
                    <input
                        type="text"
                        value={updatedPhoneNumber}
                        onChange={handlePhoneNumberChange}
                        className='w-full border px-4 py-2'
                    />
                </div>

                <button
                    className='w-full py-2 mt-4 rounded bg-purple-600 text-white hover:bg-purple-700'
                    onClick={updateUserProfile}
                >
                    Update Profile
                </button>
           </div>
        </div>
    )
}

export default UpdateUserProfile;
