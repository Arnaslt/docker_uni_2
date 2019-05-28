const commWrapper = require("./comWrap");
const fs = require("fs");
const path = require("path");
const soap = require("soap");

function soapRouter(app) {
  const xml = fs.readFileSync(
    path.resolve(__dirname, "./doAwesomeStuff.wsdl"),
    "utf8"
  );

  const CommunicatorService = {
    CommunicatorService: {
      CommunicatorPort: {
        getCars: async function(args, cb) {
          console.log("try to get cars");
          const output = await commWrapper.getCars();
          console.log("getting cars", output);
          return output;
        },
        buyCar: function(args, cb) {
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
        getUsers: async function(args, cb) {
          console.log("try to get users");
          const output = await commWrapper.getUsers();
          console.log("getting users", output);
          return output;
        },
        createUser: function(args, cb) {
          console.log("createUser()");
          const { balance, first_name } = args;
          commWrapper
            .createUser(balance, first_name)
            .then(() => {
              cb({
                result: `Car Owner of name ${first_name} has now balance ${balance} and is created created`
              });
            })
            .catch(err => {
              cb({ result: err.message });
            });
        }
      }
    }
  };

  soap.listen(app, "/soap", CommunicatorService, xml, function() {
    console.log("soap initialized");
  });
}

module.exports = soapRouter;
