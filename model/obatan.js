const mongoose = require('mongoose');
const obatSchema = mongoose.Schema({
    kodeobat        : {type: String, unique: true},
    namaobat 		: String,
    jenisobat 	    : String,
    stockobat	    : String,
    harga	        : String,
    created_at		: String
});
module.exports = mongoose.model('obatan', obatSchema);