import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import displayVNDCurrency from '../helpers/displayCurrency';
import DOMPurify from 'dompurify';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import Context from '../context';
import addToCart from '../helpers/addToCart';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  //zoom ảnh
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  });

  const [zoomImage, setZoomImage] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params.id
      })
    });
    setLoading(false);
    const dataResponse = await response.json();
    setData(dataResponse.data);
    setActiveImage(dataResponse.data.productImage[0]);
  }, [params.id]);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi params.id thay đổi
  }, [fetchProductDetails, params.id]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/* Product Images */}
        <div className='flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] lg:h-96 w-full lg:w-96 bg-slate-200 flex justify-center items-center relative p-2'>
            <img
              src={activeImage}
              className='w-full h-full object-scale-down mix-blend-multiply'
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              alt='Product'
            />
            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                <div
                  className='w-full h-full min-w-[400px] min-h-[400px] mix-blend-multiply scale-[1.4]'
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                  }}
                />
              </div>
            )}
          </div>
          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((_, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={index} />
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {data.productImage.map((imgURL) => (
                  <div className='h-[71px] w-20 bg-slate-200 rounded p-1' key={imgURL}>
                    <img
                      src={imgURL}
                      className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer'
                      onClick={() => handleMouseEnterProduct(imgURL)}
                      alt='Thumbnail'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Product Info */}
        <div className='flex flex-col gap-1'>
          <p className='bg-red-200 text-[#d70018] px-2 rounded-full inline-block w-fit font-bold'>
            {data.brandName}
          </p>
          <h2 className='text-xl lg:text-3xl font-medium'>{data.productName}</h2>
          <p className='capitalize text-slate-400'>{data.category}</p>
          <div className='text-[#ffbf00] flex items-center gap-1'>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalf />
          </div>
          <div className='flex gap-2 items-center text-2xl font-medium my-1 lg:text-3xl'>
            <p className='font-extrabold md:text-lg text-md text-[#cc0000]'>
              {displayVNDCurrency(data.sellingPrice)}
            </p>
            <p className='font-semibold md:text-lg text-md text-slate-500 line-through'>
              {displayVNDCurrency(data.price)}
            </p>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <button onClick={(e) => handleBuyProduct(e, data?._id)} className='border-2 text-lg border-[#d70018] rounded px-3 py-1 min-w-[120px] text-[#d70018] font-medium hover:bg-[#d70018] hover:text-white'>
              MUA NGAY
            </button>
            <button onClick={(e) => handleAddToCart(e, data?._id)} className='border-2 text-lg border-[#d70018] rounded px-3 py-1 min-w-[120px] text-white font-medium bg-[#d70018] hover:bg-[#d70018] hover:text-white'>
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          <div>
            <p className='text-[#d70018] my-1 font-bold text-xl'>ĐẶC ĐIỂM NỔI BẬT</p>
            <div className='font-medium' dangerouslySetInnerHTML={createMarkup(data.description)} />
          </div>
        </div>
      </div>
      {data.category && <HorizontalCardProduct category={data.category} heading={<span className="text-xl lg:text-2xl font-bold">SẢN PHẨM TƯƠNG TỰ</span>} />}
    </div>
  );
};

export default ProductDetails;
