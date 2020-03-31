import * as Yup from "yup";

const experienceProfileValidationSchema = Yup.object().shape({
  experiences: Yup.array()
    .of(
      Yup.object().shape({
        isCurrent: Yup.boolean().required("Required"),
        startDate: Yup.date()
          .min("01/01/2000", "Date should be more recent than 01/01/2000")
          .max(new Date(), "Date cannot be greater than today.")
          .required("Required"),
        endDate: Yup.date()
          .min("01/01/2000", "Date should be more recent than 01/01/2000")
          .max(new Date(), "Date cannot be greater than today.")
          .required("Required"),
        jobTitle: Yup.string()
          .min(3, "Needs at least 3 characters")
          .max(50, "No more than 50 characters")
          .required("Required"),
        companyName: Yup.string()
          .min(3, "Needs at least 3 characters")
          .max(100, "No more than 50 characters")
          .required("Required"),
        city: Yup.string()
          .min(3, "Needs at least 3 characters")
          .max(100, "No more than 50 characters")
          .required("Required"),
        state: Yup.string().required("State selection required"),
        country: Yup.string().required("Country selection required"),
        description: Yup.string()
          .min(100, "Job description must be at least 100 characters")
          .max(4000, "Limit job description to 4000 characters")
          .required("Required")
      })
    )
    .min(1)
    .nullable()
});

export default experienceProfileValidationSchema;
