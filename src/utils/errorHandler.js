const errorHandler = (error) => {
  var errorCode = 500;
  var errorMessage = "An Error Occured";

  switch (error.name) {
    case "SequelizeValidationError":
      errorCode = 400; // Bad Request
      errorMessage = "Validation error: Invalid input detected";
      break;

    case "SequelizeUniqueConstraintError":
      errorCode = 409; // Conflict
      errorMessage = "Validation error: Duplicate entry";
      break;

    case "SequelizeForeignKeyConstraintError":
      errorCode = 409; // Conflict or 400 Bad Request
      errorMessage = "Foreign key constraint error";
      break;

    case "SequelizeConnectionError":
      errorCode = 503; // Service Unavailable
      errorMessage = "Database connection error";
      break;

    case "SequelizeTimeoutError":
      errorCode = 504; // Gateway Timeout
      errorMessage = "Database query timeout";
      break;

    case "SequelizeEmptyResultError":
      errorCode = 404; // Not Found
      errorMessage = "Empty result error";
      break;

    case "SequelizeDatabaseError":
      errorCode = 500; // Internal Server Error
      errorMessage = "Database error: Incorrect Entry";
      break;

    default:
      errorCode = 500; // Internal Server Error
      errorMessage = "Database error";
      break;
  }

  return { code: errorCode, msg: errorMessage };
};

export { errorHandler };
