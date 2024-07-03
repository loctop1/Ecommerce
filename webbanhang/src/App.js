import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))
    }
  }



  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }

  useEffect(() => {
    /**thông tin người dùng */
    fetchUserDetails()
    /**thông tin giỏ hàng */
    fetchUserAddToCart()
  }, [])

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails, //thông tin người dùng
        cartProductCount, //thông tin giỏ hàng
        fetchUserAddToCart
      }}>
        <ToastContainer position="top-center" pauseOnHover={false} style={{ top: '65px' }} />
        <Header />
        <main className='min-h-[calc(100vh-120px)]'>
          <Outlet
          /**là một component đặc biệt được sử dụng trong các route để hiển thị các component con tương ứng với các route lồng nhau.
           * Khi bạn thiết lập cấu trúc các route, có thể có những route con được định nghĩa bên trong một route cha. <Outlet /> sẽ là nơi mà các component của những route con đó được render. 
           * Điều này cho phép bạn dễ dàng tạo ra cấu trúc điều hướng lồng nhau. */
          />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
