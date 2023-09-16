const sdk = require("node-appwrite");
const axios = require("axios").require;

module.exports = async (req, res) => {
  const errorHandler = (__errorMessage) => {
    res.json({ data: "error", message: __errorMessage }, 400);
  };

  const validHandler = (_data) => {
    res.json({ data: _data }, 200);
  };

  const client = new sdk.Client();
  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"] ||
    !req.variables["APPWRITE_FUNCTION_PROJECT_ID"]
  ) {
    errorHandler(
        "[Error] Environment variables are not set thus the function cannot use Appwrite SDK."
      );
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);
    //.setSelfSigned(true);
  }

  const database = new sdk.Databases(client);
  const users = new sdk.Users(client);
  let request = "";

  if (req.payload) {
    try {
        request = JSON.parse(req.payload);
    } catch (e) {
      errorHandler(`[Error] JSON Parsing Payload -> ${e}`);
    }
  } else {
    errorHandler("[Error] Payload was missing");
  }

  const { username, email, password, token } = request;

};
