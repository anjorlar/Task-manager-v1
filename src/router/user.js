const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();


//creates a new users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

// logs in a user
router.post('/users/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        // findByCredentials is a query function we built ourselves
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(500).send({
            e,
            message: 'internal server error'
        })
    }
})

// logs out a user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send({
            message: 'user logged out'
        })
    } catch (e) {
        res.status(500).send({
            e,
            message: 'internal server error'
        })
    }
})

// logs out all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({
            message: 'all sessions logged out successfully'
        })

    } catch (e) {
        res.status(500).send({
            e,
            message: 'internal server error'
        })
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    // every is an array method that gets called for all items in the array and return a boolean depending on whether the condition was fulfilled or not
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update)) // can also use the return with curly brackets as in es 6 eg { return allowedUpdate.includes(update)})

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid updates"
        })
    }
    try {
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send({
                message: "user does not exist"
            })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete("/users/me", auth, async (req, res) => {
    // const _id = req.params._id;

    try {
        // const user = await User.findByIdAndDelete(_id)
        // if (!user) {
        //     return res.status(404).send({ message: 'user does not exist' })
        // }

        // a better method to delete a logged in user
        await req.user.remove()
        res.send({
            message: "user deleted successfully",
            user: req.user
        })
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router