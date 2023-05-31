const {
  getUserController,
  putUserController,
  deleteUserController,
} = require("../controllers/UserController.js");

const getUserHandler = async (req, res) => {
  try {
    const allUsers = await getUserController();
    allUsers.length === 0
      ? res.status(400).send("No hay Usuarios registrados")
      : res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteUserController(id);
    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const putUserHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await putUserController(id, req.body, res);
    return res.status(200).json({ message: "Usuario editado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUserHandler,
  putUserHandler,
  deleteUserHandler,
};
