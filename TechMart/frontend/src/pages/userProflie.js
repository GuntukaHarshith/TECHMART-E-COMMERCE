import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import UpdateUserProfile from '../components/changeprofiledetails';
import { Link ,useNavigate} from "react-router-dom";
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({});
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [updateUserProfileDetails, setUpdateUserProfileDetails] = useState({
        email: "",
        name: "",
        phoneNumber: "",
        role: "",
        _id: ""
    });

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(SummaryApi.userProfile.url, {
                method: SummaryApi.userProfile.method,
                credentials: 'include'
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                setUserProfile(dataResponse.data);
                setUpdateUserProfileDetails({
                    email: dataResponse.data.email,
                    name: dataResponse.data.name,
                    phoneNumber: dataResponse.data.phoneNumber,
                    role: dataResponse.data.role,
                    _id: dataResponse.data._id
                });
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("Failed to load profile data.");
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);
    return (
        <div className="bg-white p-4">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <div>
                <table className="w-full userTable">
                    <tbody>
                        <tr>
                            <td className="font-semibold">Name:</td>
                            <td>
                                <div className='flex items-center justify-center w-full'>
                                    {userProfile?.name || "N/A"}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold">Phone Number:</td>
                            <td>
                                <div className='flex items-center justify-center w-full'>
                                    {userProfile?.phoneNumber || "N/A"}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold">Email:</td>
                            <td>{userProfile?.email || "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold">Account Created:</td>
                            <td>{userProfile?.createdAt ? moment(userProfile.createdAt).format('LL') : "N/A"}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="text-center mb-4 mt-2">
                                <button
                                    className="mt-8 w-full bg-white border border-purple-800 text-purple-800 p-2 rounded hover:bg-purple-800 hover:text-white transition-colors duration-300 flex items-center justify-center"
                                    onClick={() => setOpenEditProfile(true)}
                                >
                                    <MdModeEdit className="mr-2 text-lg" />
                                    <span className="text-lg">Edit Profile</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {openEditProfile && (
                <UpdateUserProfile
                    onClose={() => setOpenEditProfile(false)}
                    name={updateUserProfileDetails.name}
                    email={updateUserProfileDetails.email}
                    phoneNumber={updateUserProfileDetails.phoneNumber}
                    role={updateUserProfileDetails.role}
                    userId={updateUserProfileDetails._id}
                    callFunc={fetchUserProfile} // Refresh profile data after update
                />
            )}

            {/* Go to Orders Button */}
            <div className="flex justify-end mt-4">
                <Link to={'/order'}
                    className="bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors duration-300"
                    
                >
                    Go to Orders
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;
