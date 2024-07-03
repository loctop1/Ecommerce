import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayVNDCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { current } from '@reduxjs/toolkit';
import { loadStripe } from '@stripe/stripe-js';
import nocart from '../assets/Cart-empty-v2.webp'
import { Link } from 'react-router-dom';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const content = useContext(Context);
    const loadingCart = new Array(content.cartProductCount).fill(null);

    const fetchData = async () => {
        // setLoading(true);
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        });
        // setLoading(false);

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0); // Scroll to top when the component mounts
    }, []);

    const handleLoading = async () => {
        await fetchData()
    }

    useEffect(() => {
        setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                {
                    _id: id,
                    quantity: qty + 1
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
        }
    }

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty - 1
                    }
                )
            })

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                {
                    _id: id,
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            toast.success(responseData?.message)
            fetchData()
            content.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    const handlePayment = async () => {
        const stripePromise = await loadStripe('pk_test_51PXPQvRwdBR7JnJ9eoultmnQIBb8NZ6YzrX1gruonQqD9Dtetv7JdX71wqqR2mt7Q7CHJO0ImJgBDQVK6xzo1oVa00u9t4PJRv')
        const response = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                cartItems: data
            })
        })
        const responseData = await response.json()

        if (responseData?.id) {
            stripePromise.redirectToCheckout({ sessionId: responseData.id })
        }

        console.log("payment response", responseData)
    }

    return (
        <div className='container mx-auto lg:my-0 my-10 mb-0'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-36'>
                            <img src={nocart} className='mx-auto' />
                            Giỏ hàng của bạn đang trống.
                            <br />
                            Hãy chọn thêm sản phẩm để mua sắm nhé
                        </p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row lg:justify-between p-4'>
                {/** Thông tin giỏ hàng */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart.map((el, index) => (
                                <div key={index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
                            ))
                        ) : (
                            data.map((product, index) => (
                                <div key={product?._id + "Đang tải"} className='w-full bg-white  my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                    <div className='w-32 h-32 bg-slate-200'>
                                        <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={product?.productId?.productName} />
                                    </div>
                                    <div className='px-5 lg:px-4 py-2 relative'>
                                        {/**delete product */}
                                        <div onClick={() => deleteCartProduct(product?._id)} className='absolute right-0 text-[#cc0000] rounded-full p-2 text-xl hover:bg-[#cc0000] hover:text-white cursor-pointer'>
                                            <MdDelete />
                                        </div>
                                        <h2 className='text-base lg:text-xl text-ellipsis font-semibold'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-slate-500'>{product?.productId?.category}</p>
                                        <div className='flex gap-3'>
                                            <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>{displayVNDCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            <p className='font-semibold md:text-lg text-md text-slate-500 line-through'>{displayVNDCurrency(product?.productId?.price)}</p>
                                        </div>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <button onClick={() => decraseQty(product?._id, product?.quantity)} className='border border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-white w-6 h-6 flex justify-center items-center rounded'>-</button>
                                            <span>{product?.quantity}</span>
                                            <button onClick={() => increaseQty(product?._id, product?.quantity)} className='border border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-white w-6 h-6 flex justify-center items-center rounded' >+</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    }
                    <Link to={"/"}>
                        <button className='bg-[#cc0000] p-2 text-white w-30 mt-2 hover:bg-red-700 text-lg'>Quay lại</button>
                    </Link>
                </div>

                {/** Tổng số lượng đơn hàng */}
                {
                    data[0] && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                            {
                                loading ? (
                                    <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
                                ) : (
                                    <div className='h-36 bg-white'>
                                        <h2 className='bg-blue-600 p-2 text-white w-full mt-2'>Thông tin thanh toán</h2>
                                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                            <p>Số lượng đơn hàng:</p>
                                            <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>{totalQty}</p>
                                        </div>
                                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                            <p>Tạm tính:</p>
                                            <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>{displayVNDCurrency(totalPrice)}</p>
                                        </div>

                                        <button className='bg-[#cc0000] p-2 text-white w-full mt-2 hover:bg-red-700' onClick={handlePayment}>Mua ngay</button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default Cart;
