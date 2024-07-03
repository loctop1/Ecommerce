import React, { useContext, useEffect, useState } from 'react'
import loginIcons from '../assets/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataResponse = await fetch(SummaryApi.signIn.url, {
            method: SummaryApi.signIn.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if (dataApi.success) {
            toast.success(dataApi.message)
            navigate("/")
            fetchUserDetails()
            fetchUserAddToCart()
        }

        if (dataApi.error) {
            toast.error(dataApi.message)
        }
    }

    return (
        <section id='login'>
            <div className='mx-auto container p-4 lg:my-0 my-10 mb-0'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img className='rounded-full' src={loginIcons} alt='login Icons' />
                    </div>
                    <form className='pt-6' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='font-bold text-xl'>Email</label>
                            <div className='my-2 bg-slate-100 p-2 border-2 border-black rounded-full'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type='email'
                                    placeholder='Vui lòng điền Email của bạn'
                                    onChange={handleOnChange}
                                    name='email'
                                    value={data.email}
                                />
                            </div>
                        </div>
                        <div className='my-1'>
                            <label className='font-bold text-xl'>Mật khẩu</label>
                            <div className='my-2 bg-slate-100 p-2 flex border-2 border-black rounded-full'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Vui lòng điền mật khẩu của bạn'
                                    onChange={handleOnChange}
                                    name='password'
                                    value={data.password}
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ?
                                                (
                                                    <FaEye />
                                                )
                                                :
                                                (
                                                    <FaEyeSlash />
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-[#cc0000]'>
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button className='bg-[#d70018] hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4'>Đăng nhập</button>
                    </form>
                    <p className='my-5'>Chưa có tài khoản? <Link to={"/sign-up"} className='text-[#d70018] hover:text-red-700 hover:underline'>Đăng ký ngay.</Link></p>
                </div>
            </div>
        </section>
    )
}

export default Login
