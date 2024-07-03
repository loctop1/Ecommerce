import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {

    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        brandName: productData?.brandName,
        category: productData?.category,
        productImage: productData?.productImage || [],
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)

    const [fullScreenImage, setFullScreenImage] = useState("")

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];

        const uploadImageCloudinary = await uploadImage(file)

        setData((prevData) => ({
            ...prevData,
            productImage: [...prevData.productImage, uploadImageCloudinary.url],
        }));
    };

    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage]

        newProductImage.splice(index, 1)

        setData((prevData) => ({
            ...prevData,
            productImage: [...newProductImage],
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch(SummaryApi.updateProduct.url, {
            method: SummaryApi.updateProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const responseData = await response.json()

        if (responseData.success) {
            toast.success(responseData?.message)
            onClose()
            fetchdata()
        }

        if (responseData.error) {
            toast.error(responseData?.message)
        }
    }

    return (
        <div className='bg-black bg-opacity-50 fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-2xl'>Chỉnh sửa sản phẩm</h2>
                    <div onClick={onClose} className='w-fit ml-auto font-bold text-3xl hover:text-[#d70018] cursor-pointer'>
                        <CgClose />
                    </div>
                </div>
                <form className='grid p-4 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label className='text-xl font-semibold' htmlFor='productName'>Tên sản phẩm</label>
                    <input
                        onChange={handleOnChange}
                        value={data.productName}
                        type='text'
                        id='productName'
                        name='productName'
                        placeholder='Nhập tên sản phẩm'
                        className='p-2 bg-slate-100 border-2 border-black rounded'
                        required
                    />

                    <label className='text-xl font-semibold mt-3' htmlFor='brandName'>Thương hiệu</label>
                    <input
                        onChange={handleOnChange}
                        value={data.brandName}
                        type='text'
                        id='brandName'
                        name='brandName'
                        placeholder='Nhập tên thương hiệu'
                        className='p-2 bg-slate-100 border-2 border-black rounded'
                        required
                    />

                    <label className='text-xl font-semibold mt-3' htmlFor='category'>Danh mục sản phẩm</label>
                    <select
                        required
                        name='category'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border-2 border-black rounded'
                        value={data.category}
                    >
                        <option value={""}>
                            Vui lòng chọn
                        </option>
                        {
                            productCategory.map((el, index) => (
                                <option value={el.value} key={el.value + index}>
                                    {el.label}
                                </option>
                            ))
                        }
                    </select>

                    <label className='text-xl font-semibold mt-3' htmlFor='productImage'>Ảnh sản phẩm</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Thả tệp tin tại đây</p>
                                <input
                                    type='file'
                                    id='uploadImageInput'
                                    className='hidden'
                                    onChange={handleUploadProduct}
                                />
                            </div>
                        </div>
                    </label>
                    <div>
                        {
                            data?.productImage[0] ? (
                                <div className='flex items-center gap-2'>
                                    {
                                        data.productImage.map((el, index) => {
                                            return (
                                                <div className='relative group'>
                                                    <img
                                                        src={el}
                                                        alt='el'
                                                        width={80}
                                                        height={80}
                                                        className='bg-slate-100 border cursor-pointer'
                                                        onClick={() => {
                                                            setOpenFullScreenImage(true)
                                                            setFullScreenImage(el)
                                                        }}
                                                    />
                                                    <div onClick={() => handleDeleteProductImage(index)} className='absolute top-0 right-0 p-1 text-white bg-[#cc0000] rounded-full hidden group-hover:block cursor-pointer'>
                                                        <MdDelete />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs'>*Vui lòng thêm ảnh sản phẩm</p>
                            )
                        }
                    </div>

                    <label className='text-xl font-semibold mt-3' htmlFor='price'>Giá gốc</label>
                    <input
                        required
                        onChange={handleOnChange}
                        value={data.price}
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Nhập giá gốc'
                        className='p-2 bg-slate-100 border-2 border-black rounded'
                    />

                    <label className='text-xl font-semibold mt-3' htmlFor='sellingPrice'>Giá sale</label>
                    <input
                        required
                        onChange={handleOnChange}
                        value={data.sellingPrice}
                        type='number'
                        id='sellingPrice'
                        name='sellingPrice'
                        placeholder='Nhập giá sale'
                        className='p-2 bg-slate-100 border-2 border-black rounded'
                    />

                    <label className='text-xl font-semibold mt-3' htmlFor='sellingPrice'>Mô tả sản phẩm</label>
                    <textarea
                        onChange={handleOnChange}
                        name='description'
                        rows={3}
                        className='h-60 bg-slate-100 border resize-none p-1'
                        value={data.description}
                    >

                    </textarea>

                    <button className='px-3 my-3 py-2 bg-[#cc0000] text-white mb-10 hover:bg-red-700'>
                        Cập nhật sản phẩm
                    </button>
                </form>
            </div>
            {/** Fullscreen Image Product*/}
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )
            }
        </div>
    )
}

export default AdminEditProduct
