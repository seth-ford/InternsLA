import * as Yup from "yup";

const UserProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2 | "Too short!")
    .max(100 | "Too long!")
    .required("Required"),
  mi: Yup.string()
    .max(2 | "Too long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2 | "Too short!")
    .max(100 | "Too long!")
    .required("Required"),
  avatarUrl: Yup.string()
    .url("Must be a url")
    .max(255 | "Too long!")
    .required("Required")
});

export default UserProfileValidationSchema;
