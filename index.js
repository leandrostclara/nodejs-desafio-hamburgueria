const express = require ('express')
const app = express()
const nodemon = require ('nodemon')
const uuid = require ('uuid')

const port = 3000
const orders = []

app.use(express.json())

const checkID = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex( order => id === order.id )

    if (index < 0) {
        return response.status(404).json({error: 'Pedido não encontrado !'})
    }  

    request.orderIndex = index
    request.orderId = id
    request.orderItems = orders[index].order

    next()

}

const showMethodAndPath = (request, response, next) => {

    console.log (`${request.method} - ${request.path}`)

    next()

}

app.get ('/order', showMethodAndPath, (request, response) => {

    response.send (orders)

})

app.get ('/order/:id', checkID, showMethodAndPath, (request, response) => {

    const index = request.orderIndex

    return response.status(200).json(orders[index])

})

app.post ('/order', showMethodAndPath, (request, response) => {

    id = request.id

    const { order, clientName, price } = request.body
    const newOrder = { id:uuid.v4(), order, clientName, price, status:'Em preparação' }

    orders.push(newOrder)

    return response.status(201).json(newOrder)

})

app.put ('/order/:id', checkID, showMethodAndPath, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId
    
    const { order, clientName, price } = request.body
    const newOrder = { id, order, clientName, price, status:'Em preparação' }
    
    orders[index] = newOrder
    return response.status(201).json(newOrder)
    


})

app.delete ('/order/:id', checkID, showMethodAndPath, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex
    const orderItems = request.orderItems

    orders.splice(index,1)
    return response.status(200).json(`Pedido ${orderItems} deletado`)

})

app.patch ('/order/:id', checkID, showMethodAndPath, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId
    const orderItems = request.orderItems

    orders[index].status = 'Pronto'
    return response.status(200).json(`Pedido ${orderItems} já está pronto`)

})



app.listen (port, () => {

    console.log (`🟢 Server started at port ${port} 🟢`)

})