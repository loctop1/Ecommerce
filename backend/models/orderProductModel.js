const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productDetails: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""
    },
    paymentDetails: {
        paymentId: {
            type: String,
            default: ""
        },
        payment_method_type: [],
        payment_status: {
            type: String,
            default: ""
        }
    },
    shipping_options: [],
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to translate payment status and method type
orderSchema.methods.toJSON = function () {
    const order = this.toObject();
    const paymentStatusTranslations = {
        "": "Chưa xác định",
        "pending": "Đang chờ xử lý",
        "completed": "Đã thanh toán",
        "paid": "Đã thanh toán",
        "failed": "Thất bại"
    };
    const paymentMethodTypeTranslations = {
        "": "Không xác định",
        "credit_card": "Thẻ tín dụng",
        "paypal": "Paypal",
        "bank_transfer": "Chuyển khoản ngân hàng",
        "card": "Chuyển khoản ngân hàng"
    };

    order.paymentDetails.payment_status = paymentStatusTranslations[order.paymentDetails.payment_status] || order.paymentDetails.payment_status;
    order.paymentDetails.payment_method_type = order.paymentDetails.payment_method_type.map(type => paymentMethodTypeTranslations[type] || type);

    return order;
};

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
