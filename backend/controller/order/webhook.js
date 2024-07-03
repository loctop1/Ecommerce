const stripe = require('../../config/stripe');
const addToCartModel = require('../../models/cartProduct');
const orderModel = require('../../models/orderProductModel');

const endpointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;
/**Đây là khóa bí mật dùng để xác minh các sự kiện webhook của Stripe. Nó được lấy từ các biến môi trường. */

async function getLIneItems(lineItems) {
    /**Tham số: lineItems - các dòng sản phẩm từ phiên thanh toán Stripe. */
    let ProductItems = []
    /**Khởi tạo một mảng rỗng để lưu chi tiết sản phẩm. */

    if (lineItems?.data?.length) {
        /**Kiểm tra xem lineItems.data có tồn tại và có các mục hay không. */
        for (const item of lineItems.data) {
            /**Duyệt qua từng mục trong các dòng sản phẩm. */
            const product = await stripe.products.retrieve(item.price.product)
            /**Lấy chi tiết sản phẩm từ Stripe. */
            const productId = product.metadata.productId
            /**Lấy productId từ metadata của sản phẩm. */

            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount,
                quantity: item.quantity,
                image: product.images
            }
            /**chi tiết thông tin sản phẩm */

            ProductItems.push(productData)
            /**Thêm dữ liệu sản phẩm vào mảng ProductItems. */
        }
    }

    return ProductItems
}

const webhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    /**Lấy chữ ký Stripe từ tiêu đề của yêu cầu. */

    const payloadString = JSON.stringify(request.body)
    /**Chuyển đổi nội dung yêu cầu thành chuỗi JSON. */

    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret,
    });
    /**Tạo chuỗi tiêu đề thử nghiệm cho webhook. */

    let event;
    /**Khai báo một biến để lưu sự kiện Stripe. */

    try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            /**Xử lý các loại sự kiện Stripe khác nhau. Ở đây, nó xử lý sự kiện checkout.session.completed. */

            const session = event.data.object;
            /**Trích xuất đối tượng phiên từ sự kiện. */

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
            /**Liệt kê các dòng sản phẩm từ phiên. */

            const productDetails = await getLIneItems(lineItems)
            /**Lấy chi tiết sản phẩm cho các dòng sản phẩm. */

            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_email,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status
                },
                shipping_options: session.shipping_options.map(s => {
                    return {
                        ...s,
                        shipping_amount: s.shipping_amount
                    }
                }),
                totalAmount: session.amount_total
            }

            const order = new orderModel(orderDetails)
            /**Tạo một phiên bản mô hình đơn hàng mới với chi tiết đơn hàng. */

            const saveOrder = await order.save()
            /**Lưu đơn hàng vào cơ sở dữ liệu. */

            if (saveOrder?._id) {
                const deleteCartItem = await addToCartModel.deleteMany({ userId: session.metadata.userId })
                
            }

            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.status(200).send()
}

module.exports = webhooks