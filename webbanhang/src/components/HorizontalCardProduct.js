import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayVNDCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const HorizontalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [scroll, setScroll] = useState(0);
    const scrollElement = useRef();

    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);
        console.log("horizontal data", categoryProduct.data);
        setData(categoryProduct?.data);
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0); // Scroll to top when the component mounts
    }, []);

    const scrollRight = () => {
        const element = scrollElement.current;
        const scrollAmount = 300;
        const start = element.scrollLeft;
        const change = scrollAmount;
        const increment = 20; // smaller value makes it slower
        let currentTime = 0;

        const animateScroll = () => {
            currentTime += increment;
            const val = Math.easeInOutQuad(currentTime, start, change, 500);
            element.scrollLeft = val;
            if (currentTime < 500) {
                requestAnimationFrame(animateScroll);
            }
        };

        animateScroll();
    };

    const scrollLeft = () => {
        const element = scrollElement.current;
        const scrollAmount = 300;
        const start = element.scrollLeft;
        const change = -scrollAmount;
        const increment = 20; // smaller value makes it slower
        let currentTime = 0;

        const animateScroll = () => {
            currentTime += increment;
            const val = Math.easeInOutQuad(currentTime, start, change, 500);
            element.scrollLeft = val;
            if (currentTime < 500) {
                requestAnimationFrame(animateScroll);
            }
        };

        animateScroll();
    };

    // Easing function for smooth animation
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    return (
        <div className='container mx-auto px-4 my-2 relative'>
            <h2 className='md:text-2xl text-lg font-bold py-4 uppercase'>{heading}</h2>
            <div className='flex overflow-x-auto scrollbar-none transition-all' ref={scrollElement}>
                <div className='absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl'>
                    <button onClick={scrollLeft} className='bg-white shadow-md p-1'><FaAngleLeft /></button>
                </div>
                <div className='absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl'>
                    <button onClick={scrollRight} className='bg-white shadow-md p-1'><FaAngleRight /></button>
                </div>
                <div className='grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4'>
                    {data.map((product, index) => (
                        <Link to={`/product/${product?._id}`} key={index} className='border-black w-full bg-white rounded-sm shadow flex flex-col'>
                            <div className='h-64 w-full flex items-center justify-center rounded-t-sm hover:scale-110 transition-all'>
                                <img src={product?.productImage[0]} className='h-full w-full object-contain p-5' alt='product' />
                            </div>
                            <div className='p-4 py-0 flex-grow'>
                                <h2 className='font-semibold text-black md:text-lg text-md'>{product?.productName}</h2>
                                <p className='font-semibold text-slate-500 capitalize md:text-md text-sm'>{product?.category}</p>
                                <div className='flex gap-3 my-2'>
                                    <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>{displayVNDCurrency(product?.sellingPrice)}</p>
                                    <p className='font-semibold md:text-lg text-md text-slate-500 line-through'>{displayVNDCurrency(product?.price)}</p>
                                </div>
                            </div>
                            <div className='pr-4 pl-4 py-4'>
                                <button className='w-full rounded-full font-semibold md:text-md text-sm bg-[#cc0000] hover:bg-red-700 text-white px-3 py-2' onClick={(e) => handleAddToCart(e, product?._id)}>Thêm vào giỏ hàng</button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HorizontalCardProduct;
