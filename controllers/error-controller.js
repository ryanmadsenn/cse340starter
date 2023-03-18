const errorController = {};

errorController.throwError = async (req, res, next) => {
  throw new Error("This is a test error.");
};

module.exports = errorController;
