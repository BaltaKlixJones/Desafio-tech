const {Router } = require("express");
const userRouter = Router();
const {getUserHandler, putUserHandler, deleteUserHandler} = require('../handlers/UserHandler.js');

userRouter.get('/', getUserHandler);
userRouter.delete('/:id', deleteUserHandler);
userRouter.put('/:id', putUserHandler);

module.exports = userRouter;