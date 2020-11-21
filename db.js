const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    }
});

module.exports = ArticleSchema;