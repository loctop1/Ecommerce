async function userLogout(req, res) {
    try {
        res.clearCookie("token")

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