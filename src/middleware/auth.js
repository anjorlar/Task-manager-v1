const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: true,
            message: "Authetication needed for this route "
        })
    }
}

module.exports = auth;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disable')
//     } else {
//         next();
//     }
// });

// app.use((req, res, next) => {
//     res.status(503).send({
//         message: 'site is under maintainance'
//     })
//     next()
// })