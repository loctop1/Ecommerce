import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      <HorizontalCardProduct category={"Tai nghe AirPods"} heading={"Tai nghe AirPods bán chạy nhất"} />
      <HorizontalCardProduct category={"Đồng hồ"} heading={"Đồng hồ thông minh | Smartwatch giá rẻ"} />
      <HorizontalCardProduct category={"Điện thoại"} heading={"ĐIỆN THOẠI NỔI BẬT NHẤT"} />
      <HorizontalCardProduct category={"Chuột"} heading={"Chuột bán chạy nhất"} />
      <HorizontalCardProduct category={"Tivi"} heading={"Tivi giá rẻ"} />
      <HorizontalCardProduct category={"Máy ảnh"} heading={"Máy ảnh | Máy chụp hình"} />
      <HorizontalCardProduct category={"Tai nghe chụp tai"} heading={"Tai nghe chụp tai phổ biến"} />
      <HorizontalCardProduct category={"Loa"} heading={"Loa nghe nhạc, Loa mini"} />
      <HorizontalCardProduct category={"Tủ lạnh"} heading={"Mua tủ lạnh chính hãng, giá rẻ"} />
      <HorizontalCardProduct category={"Máy cạo râu"} heading={"Máy cạo râu | Bền bỉ an toàn"} />
      <HorizontalCardProduct category={"Máy in"} heading={"Máy in laser, in phun đa năng"} />
      <HorizontalCardProduct category={"Linh kiện máy tính"} heading={"Linh kiện máy tính, laptop, PC"} />
    </div>
  )
}

export default Home
