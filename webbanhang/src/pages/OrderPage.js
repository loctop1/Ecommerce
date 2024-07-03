import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayVNDCurrency from '../helpers/displayCurrency'

const OrderPage = () => {
    const [data, setData] = useState([])

    const fetchOrderDetails = async () => {
        const response = await fetch(SummaryApi.getOrder.url, {
            method: SummaryApi.getOrder.method,
            credentials: 'include'
        })

        const responseData = await response.json()

        setData(responseData.data)
        console.log("order list", responseData)
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [])

    return (
        <div className='container mx-auto p-4 lg:my-0 my-12 mb-0'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Lịch sử mua hàng</h1>
            {
                !data[0] && (
                    <p className='text-center text-gray-600'>Không có thông tin đơn hàng</p>
                )
            }

            <div className='w-full'>
                {
                    data.map((item, index) => {
                        return (
                            <div key={item.userId + index} className='mb-6'>
                                <p className='font-medium text-lg lg:text-xl mb-2'> Thời gian đặt hàng: Ngày {moment(item.createdAt).format('LL')}</p>
                                <div className='border-2 rounded p-4 shadow-lg'>
                                    <div className='flex flex-col lg:flex-row justify-between gap-4'>
                                        <div className='grid gap-4'>
                                            {
                                                item?.productDetails.map((product, index) => {
                                                    return (
                                                        <div key={product.productId + index} className='flex gap-3 bg-slate-100 border-2 rounded p-2'>
                                                            <img
                                                                src={product.image[0]}
                                                                className='w-28 h-28 bg-slate-200 object-scale-down p-2'
                                                            />
                                                            <div>
                                                                <div className='font-medium text-lg text-ellipsis line-clamp-1'>{product.name}</div>
                                                                <div className='flex items-center gap-5 mt-1'>
                                                                    <div className='text-lg font-bold text-[#cc0000]'>{displayVNDCurrency(product.price)}</div>
                                                                    <p className='font-bold'>Số lượng: {product.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className='flex flex-col gap-4 p-2 min-w-[300px] font-semibold'>
                                            <div>
                                                <div className='text-lg font-medium'>Chi tiết thanh toán</div>
                                                <p className='ml-1'>Phương thức thanh toán: {item.paymentDetails.payment_method_type[0]}</p>
                                                <p className='ml-1'>Trạng thái thanh toán: <span className='text-green-600 font-bold'>{item.paymentDetails.payment_status}</span> </p>
                                            </div>
                                            <div>
                                                <div className='text-lg font-medium'>Chi tiết vận chuyển</div>
                                                {
                                                    item.shipping_options.map((shipping, index) => {
                                                        return (
                                                            <div key={shipping.shipping_rate} className='ml-1'>
                                                                Phí vận chuyển: <span className='font-bold text-[#cc0000]'>{displayVNDCurrency(shipping.shipping_amount)}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className='ml-auto w-fit lg:text-lg mt-4 font-extrabold text-[#cc0000]'>
                                        Tổng số tiền: {displayVNDCurrency(item.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OrderPage
