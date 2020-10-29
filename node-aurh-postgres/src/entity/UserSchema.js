const { EntitySchema } = require("typeorm");
const User = require("../models/User").User;

module.exports = new EntitySchema({
    name: "User",
    target: User,
    columns: {
        id: {
            unique: true,
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            primary: true,
            type: "text",
            require: true,
        },
        email: {
            type: "text",
            require: true,
        },
        password: {
            type: "text",
            require: true,
        }
    }
});