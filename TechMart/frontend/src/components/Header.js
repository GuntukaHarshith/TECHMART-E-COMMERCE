import React, { useState ,useContext , useEffect} from 'react'
import Logo from "./Logo";
import { GoSearch } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay,setMenuDisplay] = useState(false)
  const navigate = useNavigate();
  const context = useContext(Context)
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
 
    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    
  }, [user, context?.cartProductCount]);
  const handleSearch = (e)=>{
    const { value } = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
  }
  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className=" h-full container mx-auto flex items-center justify-between    ">
      <div className="px-4 mt-10">
          <Link to={"/"} >
            <Logo w={120} h={80} />
          </Link>
        </div>
        <div className="hidden lg:flex items-center w-full justify-between bg-slate-200 max-w-sm shadow-sm border-rounded-full focus-within:shadow-md pl-2">
          <input
            type="text"
            placeholder="What are you looking for....?"
            className="w-full outline-none bg-slate-200 "
            onChange={handleSearch} value={search}/>
          
          <div className="text-lg min-w-[40px] flex items-center justify-center h-8  text-white bg-yellow-400 rounded-r-full cursor-pointer ">
            <GoSearch />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative  flex justify-center text-yellow-400 ">
          {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                          ) : (
                            <FaUserCircle/>
                            
                          )
                        }
                      </div>
                    )
                  }
                  {
                  
            
              menuDisplay && (
                <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded ">
                    <nav> 
                       {
                        user?.role === ROLE.ADMIN && (
                          <Link to ={"/admin-panel/all-products"} className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2" onClick={()=> setMenuDisplay(preve => !preve)}> Admin Panel</Link>
                        )
                      }
                      <Link to ={'/profile'} className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2" onClick={()=> setMenuDisplay(preve => !preve)}>Profile</Link>
                     
                    </nav>
                </div>
      
              )
            }
            
            </div>
         {
          user?._id &&(
            <Link to={"/cart"} className="text-3xl text-yellow-400 cursor-pointer relative">
            <span>
              <FaShoppingCart />
            </span>
            <div className="bg-yellow-400 text-white w-5 h-5 p-1 flex items-center justify-center rounded-full absolute -top-2 -right-2">
              <p className="text-sm"><p className='text-sm'>{context?.cartProductCount}</p>
              </p>
            </div>
          </Link>
  )
         }
          

          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-md font-medium text-white bg-yellow-300 hover:bg-yellow-400"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-3 py-1 rounded-full text-lg text-white bg-yellow-300 hover:bg-yellow-400"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
