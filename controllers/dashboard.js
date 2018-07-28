'use strict'

const Product = require('../models/product')



function getStatus(req, res) {
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` })
        if (!products) return res.status(404).send({ message: 'No existen productos' })

        res.status(200).send({ products })


    })
}






module.exports = {
    getStatus
}