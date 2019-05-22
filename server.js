const express = require("express");
const Joi = require("joi");
const app = express();
const Promise = require("bluebird");
const _ = require("lodash");
const soapRoutes = require("./soapLogic.js");
const fs = require("fs");
const path = require("path");

const {
  createUser,
  getCarOwner,
  getCarsWithOwners,
  getCarOwners
} = require("./utils");

const SOAP_PATH = "/soap";

app.use(express.json());

const cars = [
  { id: 1, name: "bmw e90", bought: true, price: 100, userId: 1 },
  { id: 2, name: "mazda miyata", bought: false, price: 95, userId: 2 },
  { id: 3, name: "mitsubishi lancer", bought: true, price: 70, userId: 3 }
];
// Helpers end here
app.get("/", (req, res) => {
  res.send("listening to port 3000");
});

app.get("/wsdl", (req, res) => {
  res.download("./doStuff.wsdl", "wsdl.wsdl");
});

app.get("/api/cars", (req, res) => {
  const GET_USERS = _.get(req.query, "embedded", false);
  console.log("GET_USERS", GET_USERS);
  if (GET_USERS && GET_USERS === "owners") {
    getCarsWithOwners().then(response => {
      if (!response.length) {
        console.log("problem");
        res.send({ cars, msg: "whoops a problem occured" });
      } else {
        console.log("all good");
        res.send(response);
      }
    });
  } else {
    res.send(cars);
  }
});

app.get("/api/users", (req, res) => {
  console.log("app get carOwner  was done");
  Promise.try(function() {
    return getCarOwners();
  })
    .then(function(items) {
      res.send(items);
    })
    .catch(function(e) {
      console.log("error in get /users", e);
    });
});

app.get("/api/cars/:id", (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send("The car with given id was not found");
  res.send(car);
});
app.get("/api/carOwner/:id", (req, res) => {
  console.log("app get carOwner  was done");
  Promise.try(function() {
    return getCarOwner(req.params.id);
  })
    .then(function(items) {
      res.send(items);
    })
    .catch(function(e) {
      console.log("error in get /", e);
    });
});
app.post("/api/carOwner", (req, res) => {
  console.log("app get carOwner  was done");
  const carId = _.get(req.body, "carId", null);
  const userId = _.get(req.body, "userId", null);
  if (!carId || !userId) {
    return res.status(400).send("not valid input");
  }
  Promise.try(function() {
    return getCarOwners();
  })
    .then(function(owners) {
      console.log("owners", Object.keys(owners));
      const ownersOk = Object.keys(owners).includes(userId.toString());
      let carsOk = false;
      let carIndex = 0;
      for (let i = 0; i < cars.length; i++) {
        if (cars[i].id == carId) {
          carsOk = true;
          carIndex = i;
        }
      }
      if (!ownersOk || !carsOk) {
        console.log("carsOk", carsOk, "ownersOk", ownersOk);
        return res.status(400).send("not valid input");
      } else {
        cars[carIndex].userId = userId;
        res.status(200).send(cars[carIndex]);
      }
      // console.log(cars);
    })
    .catch(function(e) {
      console.log("error in get /", e);
    });
});
app.post("/api/cars", (req, res) => {
  const { error } = validateCar(req.body);

  if (error) return res.status(400).send(error.details[0]);
  const userId = _.get(req.body, "userId", 1);
  const car = {
    id: cars.length + 1,
    name: req.body.name,
    bought: req.body.bought,
    price: req.body.price,
    userId
  };
  cars.push(car);
  res.status(201).send(car);
});

app.post("/api/users", (req, res) => {
  const balance = _.get(req.body, "balance", null);
  const first_name = _.get(req.body, "first_name", null);
  console.log(req.params, "params");
  if (!balance || !first_name) {
    return res.status(400).send("not valid user input");
  }
  Promise.try(function() {
    return createUser(req.body.balance, req.body.first_name);
  })
    .then(function(user) {
      console.log("user created", user);
      res.status(201).send(user);
    })
    .catch(function(e) {
      console.log("/api/users", e);
    });
});

app.put("/api/cars/:id", (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send("The car with given id was not found");

  const { error } = validateCarPut(req.body);

  if (error) return res.status(400).send(error.details[0]);

  car.name = req.body.name;
  car.bought = req.body.bought;
  car.price = req.body.price;
  car.userId = req.body.userId;
  res.send(car);
});
app.patch("/api/cars/:id", (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send("The car with given id was not found");

  const { error } = validateCar(req.body);

  if (error) return res.status(400).send(error.details[0]);

  if (req.body.name) {
    car.name = req.body.name;
  }
  if (req.body.bought) {
    car.bought = req.body.bought;
  }
  if (req.body.price) {
    car.price = req.body.price;
  }
  if (req.body.userId) {
    car.userId = req.body.userId;
  }
  res.send(car);
});

app.delete("/api/cars/:id", (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send("The car with given id was not found");

  const index = cars.indexOf(car);
  cars.splice(index, 1);
  res.send(car);
});

app.use("/api/*", (req, res) => {
  res.status(405).end();
});
const port = 3001;

app.listen(port, () => {
  // soap.listen(app, SOAP_PATH, service, wsdl, function() {
  //   console.log("server initialized");
  //   console.log(`Listening ... on port 3001`);
  // });
  soapRoutes(app);
});

function validateCar(car) {
  const schema = {
    name: Joi.string().min(3),
    bought: Joi.boolean(),
    price: Joi.number(),
    userId: Joi.number().max(3)
  };
  return Joi.validate(car, schema);
}

function validateCarPut(car) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    bought: Joi.boolean().required(),
    price: Joi.number().required(),
    userId: Joi.number()
      .max(3)
      .required()
  };

  return Joi.validate(car, schema);
}

// function validateCarByt(buyAction) {
//   const schema = {
//     carId: Joi.number().required(),
//     userId: Joi.number().required()
//   };
//   return Joi.validate(car, buyAction);
// }
