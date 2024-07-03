import React, { useState } from 'react'
import { MdModeEditOutline } from 'react-icons/md'
import AdminEditProduct from './AdminEditProduct'
import displayVNDCurrency from '../helpers/displayCurrency'

const AdminProductCard = ({
    data,
    fetchdata
}) => {

    const [editProduct, setEditProduct] = useState(false)

    return (
        <div className='bg-white p-4 rounded relative '>
            <div className='absolute top-2 right-2 w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={() => setEditProduct(true)}>
                <MdModeEditOutline />
            </div>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full' />
                </div>
                <h1 className='py-1 font-bold text-ellipsis line-clamp-2'>{data?.productName}</h1>

                <div>
                    <div className='text-[#d70018] font-bold'>
                        {
                            displayVNDCurrency(data.sellingPrice)
                        }
                    </div>
                </div>
            </div>
            {
                editProduct && (
                    <>
                        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setEditProduct(false)}></div>
                        <div className='fixed inset-0 flex justify-center items-center z-50'>
                            <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default AdminProductCard
