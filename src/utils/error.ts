const getErrorMessage = (
  error: any,
  fallback = "Something went wrong. Please try again."
): string => {
  const responseMessage = error?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage[0] ?? fallback;
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "Unable to reach the server. Please check your connection.";
  }

  return fallback;
};

export { getErrorMessage };
