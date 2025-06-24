import React, { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from '../common/index';
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",  
    confirmpassword: "",
  });
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(data.password === data.confirmpassword){
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const dataApi = await dataResponse.json();
      
      if(dataApi.success){
        toast.success(dataApi.message);
        navigate("/login");
      }
      if(dataApi.error){
        toast.error(dataApi.message);
      }
    } else {
      toast.error("Both password and Confirm password should be the same");
    }
  };

  return (
    <section id="login" className="min-h-screen flex justify-center items-center">
      <div className="container p-20 px-11 flex justify-center">
        <div className="bg-white p-2 py-5 w-full max-w-md mx-auto">
          <div className="text-2xl font-serif p-4 underline flex justify-center">
            Create an Account!
          </div>
          <form className="p-3 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid">
              <label className="text-lg">Name:</label>
              <div className="bg-slate-100 p-2">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  placeholder="Enter your Name"
                />
              </div>
            </div>
            <div className="grid">
              <label className="text-lg">Phone Number:</label>
              <div className="bg-slate-100 p-2">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  name="phoneNumber" // Added phoneNumber input
                  value={data.phoneNumber}
                  onChange={handleOnChange}
                  required
                  placeholder="Enter your Phone Number"
                  type="tel"
                />
              </div>
            </div>
            <div className="grid">
              <label className="text-lg">Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  type="email"
                  placeholder="Enter your Email ID"
                />
              </div>
            </div>
            <div className="grid">
              <label className="text-lg">Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  required
                  placeholder="Enter your Password"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>
            <div className="grid">
              <label className="text-lg">Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.confirmpassword}
                  name="confirmpassword"
                  onChange={handleOnChange}
                  required
                  placeholder="Confirm Password"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <span>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>
            <div className="py-3">
              <button className="w-40 min-h-full py-1 text-xl text-white px-2 bg-yellow-300 rounded-full hover:bg-yellow-400 scale-90 transition-all mx-auto block mt-6">
                Sign Up
              </button>
            </div>
          </form>
          <p className="my-5">
            Already have an Account?{" "}
            <Link
              to={"/login"}
              className="text-yellow-300 hover:text-yellow-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
