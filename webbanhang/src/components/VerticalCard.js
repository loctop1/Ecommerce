import React, { useContext } from 'react';
import scrollTop from '../helpers/scrollTop';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import displayVNDCurrency from '../helpers/displayCurrency';

const VerticalCard = ({ loading, data = [] }) => {
    const loadingList = new Array(13).fill(null);
    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    return (
        <div className='container mx-auto '>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {loading ? (
                    loadingList.map((_, index) => {
                        return (
                            <div
                                key={index}
                                className='w-full bg-white rounded-sm shadow-lg'
                            >
                                <div className='bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse'></div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                                    <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2'></p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
                                        <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
                                    </div>
                                    <button className='text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse'></button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    data.map((product, index) => {
                        return (
                            <Link
                                to={'/product/' + product?._id}
                                className='w-full bg-white rounded-sm shadow-lg flex flex-col'
                                onClick={scrollTop}
                                key={index}
                            >
                                <div className='h-64 w-full flex items-center justify-center rounded-t-sm overflow-hidden'>
                                    <img
                                        src={product?.productImage[0]}
                                        className='h-full w-full object-contain p-5 transition-transform hover:scale-110'
                                        alt='product'
                                    />
                                </div>
                                <div className='p-4 py-2 flex-grow'>
                                    <h2 className='font-semibold text-black md:text-lg text-xl'>{product?.productName}</h2>
                                    <p className='font-semibold text-slate-500 capitalize md:text-md text-sm line-clamp-1'>{product?.category}</p>
                                    <div className='flex gap-3 my-2'>
                                        <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>
                                            {displayVNDCurrency(product?.sellingPrice)}
                                        </p>
                                        <p className='font-semibold md:text-lg text-md text-slate-500 line-through'>
                                            {displayVNDCurrency(product?.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className='pr-4 pl-4'>
                                    <button
                                        className='w-full rounded-full font-semibold md:text-md text-base bg-[#cc0000] hover:bg-red-700 text-white px-3 py-2 transition-colors'
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VerticalCard;
