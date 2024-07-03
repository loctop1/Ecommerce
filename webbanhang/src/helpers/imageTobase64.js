//Chức năng tải ảnh đại diện
const imageTobase64 = async (image) => {
    const reader = new FileReader()
    /**FileReader là một API của trình duyệt cho phép đọc nội dung của các tệp (ví dụ: hình ảnh) dưới dạng các kiểu dữ liệu khác nhau, bao gồm cả base64. */
    reader.readAsDataURL(image)
    /**Phương thức readAsDataURL bắt đầu đọc tệp và khi quá trình đọc hoàn tất, kết quả sẽ được lưu trữ dưới dạng base64 trong thuộc tính result của reader. */

    const data = await new Promise((resolve, reject) => {
        /**Sử dụng Promise để xử lý quá trình đọc tệp bất đồng bộ. resolve và reject là các hàm callback để hoàn thành hoặc từ chối Promise. */
        reader.onload = () => resolve(reader.result)
        /**Khi tệp được đọc thành công (onload), gọi hàm resolve để hoàn thành Promise và trả về kết quả dưới dạng base64. */
        reader.onerror = error => reject(error)
        /**Nếu có lỗi xảy ra trong quá trình đọc tệp (onerror), gọi hàm reject để từ chối Promise và trả về lỗi. */
    })

    return data;
    /**Chờ Promise hoàn tất và trả về dữ liệu base64. */
}

export default imageTobase64