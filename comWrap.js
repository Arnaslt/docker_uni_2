const { getAllCars, changeCarOwner } = require("./utils");
class CommunicateWrapper {
  getCars() {
    return getAllCars();
  }
  carChangeOwner(itemId, userId) {
    return changeCarOwner(userId, itemId);
  }
}

module.exports = new CommunicateWrapper();
