const req = require("request-promise");
const Promise = require("bluebird");

function getAllCars() {
  return Promise.try(() => {
    return req({
      uri: "http://cars:3001/api/cars",
      json: true
    });
  })
    .then(body => {
      console.log("received resp from get all cars");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      console.log("the erroe was", resp);
      throw resp.error;
    });
}
function getAllCarsAndOwners() {
  return Promise.try(() => {
    return req({
      uri: "http://cars:3001/api/cars",
      json: true
    });
  })
    .then(body => {
      console.log("received resp from get all cars");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      console.log("the erroe was", resp);
      throw resp.error;
    });
}
function getCarsWithOwners() {
  return Promise.try(() => {
    return req({
      uri: "http://users:3000/api/users",
      json: true
    });
  })
    .then(async users => {
      output = [];
      const cars = await req({
        uri: "http://cars:3001/api/cars",
        json: true
      });
      console.log("cars are", cars);
      for (let i = 0; i < cars.length; i++) {
        output[i] = {
          ...cars[i],
          user: users[cars[i].userId]
        };
      }
      console.log("output", output);
      return output;
    })
    .catch(e => []);
}
function changeCarOwner(userId, carId) {
  return Promise.try(() => {
    return req({
      uri: "http://cars:3001/api/carOwner",
      json: true,
      method: "POST",
      body: {
        carId,
        userId
      }
    });
  })
    .then(body => {
      console.log("received resp");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      throw resp.error;
    });
}
function getCarOwners() {
  return Promise.try(() => {
    return req({
      uri: "http://users:3000/api/users",
      json: true
    });
  })
    .then(body => {
      console.log("received resp");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      throw resp.error;
    });
}
function getCarOwner(id) {
  return Promise.try(() => {
    return req({
      uri: "http://users:3000/api/users/" + id,
      json: true
    });
  })
    .then(body => {
      console.log("received resp");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      throw resp.error;
    });
}
function createUser(balance, first_name) {
  return Promise.try(() => {
    return req({
      uri: "http://users:3000/api/users/",
      json: true,
      method: "POST",
      body: {
        balance,
        first_name
      }
    });
  })
    .then(body => {
      console.log("received resp");
      console.dir(body);
      if (body.error) throw new Error(body.message);
      return body;
    })
    .catch(function(resp) {
      throw resp.error;
    });
}

var net = require("net");
var getIPAddress = function getNetworkIP(callback) {
  var socket = net.createConnection(80, "www.google.com");
  socket.on("connect", function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on("error", function(e) {
    callback(e, "error");
  });
};

module.exports = {
  createUser,
  getCarOwner,
  getCarsWithOwners,
  getCarOwners,
  getAllCars,
  getIPAddress,
  changeCarOwner
};
