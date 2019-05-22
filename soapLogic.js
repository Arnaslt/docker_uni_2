const commWrapper = require("./comWrap");
const fs = require("fs");
const path = require("path");
const soap = require("soap");

function soapRouter(app) {
  const xml = fs.readFileSync(
    path.resolve(__dirname, "./doStuff.wsdl"),
    "utf8"
  );

  const CommunicatorService = {
    CommunicatorService: {
      CommunicatorPort: {
        getCars: async function(args) {
          console.log("try to get cars");
          const output = await commWrapper.getCars();
          console.log("getting cars", output);
          return output;
        },
        carChangeOwner: function(args, cb) {
          const { itemId, userId } = args;
          commWrapper
            .carChangeOwner(itemId, userId)
            .then(() => {
              cb({
                result: `Car Owner of car ${itemId} is now ${userId}`
              });
            })
            .catch(err => {
              cb({ result: err.message });
            });
        },
        createUser: function(args, cb) {
          const balance = args.balance;
          const first_name = args.first_name;
          commWrapper
            .createUser(balance, first_name)
            .then(() => {
              cb({
                result: `Car Owner of balance ${balance} is now ${first_name} created`
              });
            })
            .catch(err => {
              cb({ result: err.message });
            });
        },
        getUsers: async function(args) {
          console.log("try to get users");
          const output = await commWrapper.getUsers();
          console.log("getting users", output);
          return output;
        }
      }
    }
  };

  soap.listen(app, "/soap", CommunicatorService, xml, function() {
    console.log("soap initialized");
  });
}

module.exports = soapRouter;
