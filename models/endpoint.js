const mongoose = require('mongoose')
const Schema = mongoose.Schema

const endpointSchema = new Schema({
    method: {
        type: String
    },
    path: {
        type: String
    },
    handler: {
        type: String
    },
    routeId: {
        type: Schema.Types.ObjectId
    }
})

const Endpoint = mongoose.model('Endpoint', endpointSchema)

module.exports = Endpoint