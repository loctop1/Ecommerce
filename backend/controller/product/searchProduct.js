const productModel = require("../../models/productModel")

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q
        /**Dòng này trích xuất tham số truy vấn tìm kiếm q từ chuỗi truy vấn của yêu cầu. */

        const regex = new RegExp(query, 'i', 'g')
        /**Dòng này tạo một đối tượng biểu thức chính quy mới regex sử dụng truy vấn tìm kiếm. Cờ 'i' làm cho tìm kiếm không phân biệt chữ hoa chữ thường, và cờ 'g' cho phép tìm kiếm 
         * toàn cục (mặc dù trong ngữ cảnh này, cờ 'g' không cần thiết cho một thao tác tìm kiếm đơn lẻ). */

        const product = await productModel.find({
            "$or": [
                {
                    productName: regex
                },
                {
                    category: regex
                }
            ]
        })
        /**Dòng này thực hiện một tìm kiếm bất đồng bộ trong bộ sưu tập productModel. Nó sử dụng toán tử $or để tìm các tài liệu mà trường productName hoặc category khớp với mẫu regex. */

        res.json({
            data: product,
            message: "Tìm kiếm danh sách sản phẩm",
            error: false,
            success: true
        })
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = searchProduct