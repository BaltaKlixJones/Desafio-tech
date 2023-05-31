const { User } = require("../db");

const getUserController = async () => {
  const user = await User.findAll();
  return user;
};

const deleteUserController = async (id) => {
  const userDelete = await User.findByPk(id);
  if (!userDelete) {
    return res.status(400).json({ error: "User not found" });
  }
  return userDelete.destroy();
};

const putUserController = async (id, { email, status, rol }, res) => {
  const userUpdate = await User.findByPk(id);
  if (!userUpdate) {
    res.status(400).json({ error: "User not found" });
  } else {
    await userUpdate.update({
      email,
      status,
      rol,
    });
  }
  return userUpdate;
};
module.exports = {
  getUserController,
  deleteUserController,
    putUserController,
};
