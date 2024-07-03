const express = require('express')
/**Dòng này nhập mô-đun Express, một khung ứng dụng 
 * web cho Node.js giúp xây dựng các ứng dụng web và API. */
const cors = require('cors')
/**Dòng này nhập mô-đun CORS (Cross-Origin Resource Sharing), 
 * cho phép máy chủ của bạn chấp nhận các yêu cầu từ các nguồn 
 * khác nhau. Điều này hữu ích để cho phép các yêu cầu từ các 
 * miền khác nhau trong các ứng dụng web. */
const cookieParser = require('cookie-parser')
require('dotenv').config()
/**Dòng này tải các biến môi trường từ tệp .env vào process.env. 
 * Gói dotenv được sử dụng để quản lý cấu hình thông qua các 
 * biến môi trường. */
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()
/**Dòng này khởi tạo một ứng dụng Express bằng cách gọi hàm 
 * express(). Biến app bây giờ giữ một instance của ứng dụng 
 * Express. */
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
/**Dòng này áp dụng middleware CORS cho ứng dụng Express. Nó cho 
 * phép CORS cho tất cả các tuyến và nguồn mặc định, cho phép máy 
 * chủ của bạn xử lý các yêu cầu từ bất kỳ nguồn nào. */

app.use(express.json({ limit: '50mb' }))

app.use(cookieParser())

app.use("/api", router)
/**Dòng này đăng ký middleware cho các tuyến đường bắt đầu bằng "/api". 
 * Điều này có nghĩa là tất cả các yêu cầu đến "/api" sẽ được xử lý 
 * bởi router được định nghĩa trong tệp routes. */

const PORT = 8080 || process.env.PORT
/**Dòng này đặt biến PORT thành 8080 nếu process.env.PORT không 
 * được xác định. Tuy nhiên, dòng này có lỗi logic; nó nên là 
 * process.env.PORT || 8080 để sử dụng biến môi trường nếu nó 
 * tồn tại, nếu không sẽ mặc định là 8080. */
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Kết nối với DB")
        console.log("Server đang chạy")
    })
})
/**Đoạn mã này gọi hàm connectDB để kết nối với cơ sở dữ liệu, sau đó 
 * nếu kết nối thành công, máy chủ Express sẽ bắt đầu lắng nghe trên 
 * cổng PORT. Khi server khởi động thành công, hai thông báo sẽ được 
 * ghi ra console: "Kết nối với DB" và "Server đang chạy". */