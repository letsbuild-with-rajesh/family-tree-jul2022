export const handleErrors = (error) => {
  console.error(error.code ? error.code : error);
  let alertMsg = "Something went wrong! Please try again later.";
  switch (error.code) {
    case "auth/user-not-found":
      alertMsg = "No user with the provided Email Id exist! Please sign up.";
      break;
    case "auth/invalid-email":
    case "auth/wrong-password":
      alertMsg = "Invalid Credentials";
      break;
    case "auth/email-already-in-use":
      alertMsg = "Email Id already exists! Please Sign in.";
      break;
    case "permission-denied":
      alertMsg = "Access Denied!";
      break;
    case "storage/unauthorized":
      alertMsg = "Unauthorized to upload picture";
      break;
    case "storage/canceled":
      alertMsg = "Upload cancelled!";
      break;
    case "storage/unknown":
      alertMsg = "Unknown storage error";
      break;
    default:
      break;
  }
  alert(alertMsg);
};
