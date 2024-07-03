import React, { useState } from 'react'
import loginIcons from '../assets/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: "" // Ảnh đại diện
    })

    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value,
            }
        })
    }

    // Tải ảnh đại diện
    const handleUploadPic = async (e) => {
        const file = e.target.files[0]
        const imagePic = await imageTobase64(file)
        setData((preve) => {
            return {
                ...preve,
                profilePic: imagePic
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password === data.confirmPassword) {
            const dataResponse = await fetch(SummaryApi.signUp.url, {
                method: SummaryApi.signUp.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate("/login")
            }

            if (dataApi.error) {
                toast.error(dataApi.message)
            }

        } else {
            console.log("Vui lòng kiểm tra lại mật khẩu")
        }
    }
    return (
        <section id='signup'>
            <div className='mx-auto container p-4 lg:my-0 my-10 mb-0'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full shadow-md'>
                        <img src={data.profilePic || loginIcons} alt='login Icons' className='w-full h-full object-cover' />
                        <form className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300'>
                            <label className='flex flex-col items-center cursor-pointer'>
                                <svg className='w-6 h-6 text-white mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 7V4a1 1 0 011-1h3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H7l-3 3v11a2 2 0 002 2z' /></svg>
                                <span className='text-white text-[11px]'>Ảnh đại diện</span>
                                <input onChange={handleUploadPic} type='file' className='hidden' />
                            </label>
                        </form>
                    </div>
                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='font-bold text-xl'>Họ và tên</label>
                            <div className='my-2 bg-slate-100 p-2 border-2 border-black rounded-full'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type='text'
                                    placeholder='Họ và tên*'
                                    onChange={handleOnChange}
                                    name='name'
                                    value={data.name}
                                    required
                                />
                            </div>
                        </div>
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
                                    required
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
                                    required
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
                        </div>
                        <div className='my-1'>
                            <label className='font-bold text-xl'>Nhập lại mật khẩu</label>
                            <div className='my-2 bg-slate-100 p-2 flex border-2 border-black rounded-full'>
                                <input
                                    className='w-full h-full outline-none bg-transparent'
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Vui nhập lại mật khẩu của bạn'
                                    onChange={handleOnChange}
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    required
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showConfirmPassword ?
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
                        </div>
                        <button className='bg-[#d70018] hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4'>Đăng ký</button>
                    </form>
                    <p className='my-5'>Bạn đã có tài khoản? <Link to={"/login"} className='text-[#d70018] hover:text-red-700 hover:underline'>Đăng nhập ngay.</Link></p>
                </div>
            </div>
        </section>
    )
}

export default SignUp
