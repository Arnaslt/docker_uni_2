const {
  getAllCars,
  getCarsWithOwners,
  changeCarOwner,
  createUser,
  getCarOwners
} = require("./utils");
class CommunicateWrapper {
  getCars() {
    return getCarsWithOwners();
    // return getAllCars();
  }
  getUsers() {
    return getCarOwners();
  }
  carChangeOwner(itemId, userId) {
    return changeCarOwner(userId, itemId);
  }
  createUser(balance, first_name) {
    return createUser(balance, first_name);
  }
}

module.exports = new CommunicateWrapper();
