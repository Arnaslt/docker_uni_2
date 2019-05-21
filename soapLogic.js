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
        }
      }
    }
  };

  soap.listen(app, "/soap", CommunicatorService, xml, function() {
    console.log("soap initialized");
  });
}

module.exports = soapRouter;
