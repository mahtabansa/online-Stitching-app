// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err); // sirf server logs me full detail

  // Mongo/network related errors ko generic bana do
  if (
    err.name === "MongoNetworkError" ||
    err.code === "ENOTFOUND" ||
    err.message?.includes("getaddrinfo")
  ) {
    return res.status(503).json({
      message: "Service temporarily unavailable. Please try again later.",
    });
  }

  return res.status(err.statusCode || 500).json({
    message: "Something went wrong. Please try again.",
  });
};

