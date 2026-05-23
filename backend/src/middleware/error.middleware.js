const errorHandler = (error, req, res, next) => {
  console.error("Critical backend error:", error.message);

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    data: null,
  });
};

module.exports = errorHandler;
