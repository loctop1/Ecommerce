async function userLogout(req, res) {
    try {
        const tokenOption = {
            httpOnly: true,
            // secure: true, // Tạm thời loại bỏ
            // sameSite: 'None', // Tạm thời loại bỏ
        }

        res.clearCookie("token", tokenOption)

        res.json({
            message: "Đăng xuất thành công",
            error: false,
            success: true,
            data: []
        })
    } catch (error) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}
module.exports = userLogout