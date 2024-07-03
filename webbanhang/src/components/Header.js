import React, { useContext, useState } from 'react';
import Logo from './Logo';
import { FaSearch } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
    const user = useSelector(state => state?.user?.user);
    const dispatch = useDispatch();
    const [menuDisplay, setMenuDisplay] = useState(false);
    const context = useContext(Context);
    const navigate = useNavigate();
    const searchInput = useLocation()
    const URLSearch = new URLSearchParams(searchInput?.search)
    const searchQuery = URLSearch.getAll("q")
    const [search, setSearch] = useState(searchQuery)

    const handleLogout = async () => {
        const fetchData = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials: 'include'
        });

        const data = await fetchData.json();

        if (data.success) {
            toast.success(data.message);
            dispatch(setUserDetails(null));
            navigate("/")
        }
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearch(value)
        if (value) {
            navigate(`/search?q=${value}`);
        } else {
            navigate("/search");
        }
    };

    return (
        <header className='h-16 shadow-md bg-white sticky top-0 z-50 '>
            <div className='h-full container mx-auto flex items-center px-4 justify-between'>
                <div>
                    <Link to={"/"}>
                        <Logo w={125} h={60} />
                    </Link>
                </div>
                <div className='hidden lg:flex items-center w-full justify-between max-w-sm border-2 border-black rounded-full focus-within:shadow-md'>
                    <input className='rounded-full w-full outline-none p-1' type="text" placeholder='Tìm kiếm...' onChange={handleSearch} value={search} />
                    <div className='cursor-pointer text-lg min-w-[50px] h-8 bg-[#cc0000] flex items-center justify-center rounded-r-full text-white'>
                        <FaSearch />
                    </div>
                </div>
                <div className='flex items-center gap-7'>
                    <div className='relative group flex justify-center'>
                        {user?._id && (
                            <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                                {user?.profilePic ? (
                                    <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                                ) : (
                                    <FaRegCircleUser />
                                )}
                            </div>
                        )}
                        {menuDisplay && (
                            <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                                <nav>
                                    {
                                        user?.role === ROLE.ADMIN && (
                                            <Link onClick={() => setMenuDisplay(prev => !prev)} to={"admin-panel/all-users"} className='whitespace-nowrap hidden md:block hover:bg-gray-200 p-2 text-black'>Quản trị viên</Link>
                                        )
                                    }
                                    <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-gray-200 p-2 text-black'>Đơn hàng đã mua</Link>
                                </nav>
                            </div>
                        )}
                    </div>
                    {user?._id && (
                        <Link to={"/cart"} className='text-3xl relative'>
                            <span className='cursor-pointer'>
                                <FaShoppingCart />
                            </span>
                            <div className='bg-[#d70018] text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-2'>
                                <p className='text-xs'>{context?.cartProductCount}</p>
                            </div>
                        </Link>
                    )}
                    <div>
                        {user?._id ? (
                            <button onClick={handleLogout} className='px-3 py-1 rounded-full bg-[#d70018] text-white hover:bg-red-800'>Đăng xuất</button>
                        ) : (
                            <Link to={"/login"} className='px-3 py-1 rounded-full bg-[#d70018] text-white hover:bg-red-800'>Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Search Bar */}
            <div className='lg:hidden fixed top-[3.75rem] left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-2 z-50'>
                <div className='max-w-sm mx-auto'>
                    <div className='relative'>
                        <input
                            className='w-full h-11 rounded-full outline-none px-4 py-2 border border-gray-300 focus:border-black'
                            type="text"
                            placeholder='Tìm kiếm...'
                            onChange={handleSearch}
                        />
                        <div className='absolute inset-y-0 right-0 cursor-pointer text-lg min-w-[50px] h-11 bg-[#cc0000] flex items-center justify-center rounded-r-full text-white'>
                            <FaSearch />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
