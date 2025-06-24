import React, { useState, useContext } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash, FaSleigh } from "react-icons/fa";
import { Link ,useNavigate} from "react-router-dom";
import SummaryApi from '../common/index';
import { toast } from "react-toastify";
import Context from "../context";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    identifier: "",  
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetails();
      fetchUserAddToCart();
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  console.log("data login", data);

  return (
    <section id="login" className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-2 py-5 w-full max-w-md mx-auto">
        <div className="text-2xl underline font-serif p-4 py- flex justify-center">
          Welcome Back!
        </div>
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="text-lg">Email or Phone Number:</label> {/* Updated label */}
            <div className="bg-slate-100 p-2">
              <input
                className="w-full h-full outline-none bg-transparent"
                name="identifier" // Changed input name to "identifier"
                value={data.identifier}
                onChange={handleOnChange}
                type="text" // Changed type to "text" to accept both email and phone number
                placeholder="Enter your Email or Phone Number"
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
                placeholder="Enter your Password"
              />
              <div
                className="cursor-pointer text-xl"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="block w-fit ml-auto hover:underline hover:text-yellow-300"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="py-3">
            <button className="w-40 min-h-full py-1 text-xl text-white px-2 bg-yellow-300 rounded-full hover:bg-yellow-400 scale-90 transition-all mx-auto block mt-6">
              Login
            </button>
          </div>
        </form>
        <p className="my-5">
          Don’t Have An Account?{" "}
          <Link
            to={"/sign-up"}
            className="text-yellow-300 hover:text-yellow-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
