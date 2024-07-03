const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new Error("Vui lòng điền Email của bạn")
        }
        if (!password) {
            throw new Error("Vui lòng điền mật khẩu của bạn!")
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            throw new Error("Tài khoản hoặc mật khẩu không chính xác!")
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        console.log("checkPassoword", checkPassword)

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
            }
            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

            const tokenOption = {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            }

            res.cookie("token", token, tokenOption).status(200).json({
                message: "Đăng nhập thành công",
                data: token,
                success: true,
                error: false
            })

        } else {
            throw new Error("Tài khoản hoặc mật khẩu không chính xác!")
        }

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }

}

module.exports = userSignInController