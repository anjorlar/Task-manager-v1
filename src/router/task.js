const express = require('express');
const Task = require('../models/task');
const { update } = require('../models/task');

const router = express.Router();



router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(_id)
        updates.forEach((update) => task[update] = newTask[update])
        await task.save()
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
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