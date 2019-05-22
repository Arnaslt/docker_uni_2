const { getAllCars, changeCarOwner, createUser } = require("./utils");
class CommunicateWrapper {
  getCars() {
    return getAllCars();
  }
  carChangeOwner(itemId, userId) {
    return changeCarOwner(userId, itemId);
  }
  createUser(balance, first_name) {
    return createUser(balance, first_name);
  }
}

module.exports = new CommunicateWrapper();
