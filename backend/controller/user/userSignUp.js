const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name } = req.body

        const user = await userModel.findOne({ email })

        console.log("user", user)

        if (user) {
            throw new Error("Tài khoản này đã tồn tại!")
        }

        if (!email) {
            {
                throw new Error("Vui lòng cung cấp địa chỉ Email của bạn!")
            }
        }
        if (!password) {
            {
                throw new Error("Vui lòng cung cấp mật khẩu của bạn!")
            }
        }
        if (!name) {
            {
                throw new Error("Vui lòng nhập họ và tên của bạn!")
            }
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt)

        if (!hashPassword) {
            throw new Error("Mật khẩu không hợp lệ!")
        }

        const payload = {
            ...req.body,
            role: "GENERAL",
            password: hashPassword
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "Đã tạo tài khoản thành công!"
        })
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = userSignUpController
