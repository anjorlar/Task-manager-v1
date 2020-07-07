const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();



router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, // the spread operator ... will copy all the properties in the request body to the task variable
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get /tasks?completed=true //?completed=true
// /tasks?limit=2&query=2
// /tasks?sortBy=createdAt:asc or sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1 //using ternary operator to sort createdAt or updatedAt both seperated with bracket notation[0] after spliting the string by desc(descending(-1)) asc(ascending(1))
    }
    try {
        const alltasks = await req.user.populate({
            // owner: req.user._id,
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(alltasks.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const newTask = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed']
    // every is an array method that gets called for all items in the array and return a boolean depending on whether the condition was fulfilled or not
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ message: 'invalid update' })
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = newTask[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send({ message: 'user does not exist' })
        }
        res.send({
            message: "task deleted successfully",
            task
        })
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router;