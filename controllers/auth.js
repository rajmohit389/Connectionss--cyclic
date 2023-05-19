const User = require('../models/user')

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        if (req.file) {
            registeredUser.pic = { url: req.file.path, filename: req.file.filename }
            await registeredUser.save()
        }
        req.login(registeredUser, (err => {
            if (err) {
                res.status(500).json({ error: "Some problem in register" })
            }
            res.status(200).json({ user: req.user, message: "Successfully! created an account and logged In with username " + req.user.username })
        }))
    }
    catch (e) {
        if (e.keyValue) {
            if (e.keyValue.email) {
                e.message = "Account with email " + e.keyValue.email + " already existing"
            }
        }
        res.status(500).json({ error: e.message })
    }
}

module.exports.loginUser = (req, res) => {
    res.status(200).json({ user: req.user, message: "Welcome back " + req.user.username })
}

module.exports.logoutUser = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.status(500).json({ error: "Some problem in logging Out" })
        }
        res.status(200).json({ message: "Goodbye! See you back soon " })
    })
}
