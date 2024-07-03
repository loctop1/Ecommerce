import React, { useEffect, useState } from 'react'
import image1 from '../assets/banner/banner iPad Air M2-1_PC.jpg'
import image2 from '../assets/banner/banner iPhone 15 Pro Max T6_PC.jpg'
import image3 from '../assets/banner/banner iMac T6_PC.jpg'
import image4 from '../assets/banner/banner watch 9 T6_PC.jpg'
import image5 from '../assets/banner/banner MacBook Air M1 T6_PC.jpg'
import image6 from '../assets/banner/banner AirPods Pro 2 T6_PC.jpg'
import image7 from '../assets/banner/banner iPad Air 5 T6_PC.jpg'

import image1Mobile from '../assets/banner/banner iPad Air M2-1_PC.jpg'
import image2Mobile from '../assets/banner/banner iPhone 15 Pro Max T6_PC.jpg'
import image3Mobile from '../assets/banner/banner iMac T6_PC.jpg'
import image4Mobile from '../assets/banner/banner watch 9 T6_PC.jpg'
import image5Mobile from '../assets/banner/banner MacBook Air M1 T6_PC.jpg'
import image6Mobile from '../assets/banner/banner AirPods Pro 2 T6_PC.jpg'
import image7Mobile from '../assets/banner/banner iPad Air 5 T6_PC.jpg'


import { FaAngleRight } from 'react-icons/fa'
import { FaAngleLeft } from 'react-icons/fa'

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7
    ]

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile,
        image6Mobile,
        image7Mobile
    ]

    const nextImage = () => {
        if (currentImage === desktopImages.length - 1) {
            setCurrentImage(0)
        } else {
            setCurrentImage(prev => prev + 1)
        }
    }

    const prevImage = () => {
        if (currentImage === 0) {
            setCurrentImage(desktopImages.length - 1)
        } else {
            setCurrentImage(prev => prev - 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [currentImage])

    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='w-full bg-slate-200 h-52 md:h-96 relative '>
                <div className='absolute z-10 h-full w-full flex items-center '>
                    <div className='flex justify-between text-2xl w-full'>
                        <button onClick={prevImage} className='bg-white shadow-md p-1'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md p-1'><FaAngleRight /></button>
                    </div>
                </div>
                {/**Desktop */}
                <div className='md:flex hidden h-full w-full overflow-hidden'>
                    {desktopImages.map((imageUrl, index) => (
                        <div
                            className='w-full h-full min-w-full min-h-full transition-all'
                            key={index}
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageUrl} className='w-full h-full' />
                        </div>
                    ))}
                </div>

                {/**Mobile */}
                <div className='h-full w-full overflow-hidden flex md:hidden'>
                    {desktopImages.map((imageUrl, index) => (
                        <div
                            className='w-full h-full min-w-full min-h-full transition-all'
                            key={index}
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageUrl} className='w-full h-full' />
                        </div>
                    ))}
                </div>
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                    {mobileImages.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${currentImage === index ? 'bg-black' : 'bg-gray-400'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setCurrentImage(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BannerProduct
