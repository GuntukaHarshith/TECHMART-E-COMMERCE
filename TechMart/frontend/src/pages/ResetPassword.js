import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common';

const ResetPassword = () => {
    const { token } = useParams(); 
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(SummaryApi.resetPassword.url, {
            method: SummaryApi.resetPassword.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resetToken: token, newPassword })
        });
        const data = await response.json();
        
        if (data.success) {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;
