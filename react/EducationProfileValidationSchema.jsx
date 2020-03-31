import * as Yup from "yup";

const educationProfileValidationSchema = Yup.object().shape({
  educations: Yup.array()
    .of(
      Yup.object().shape({
        certificateTypeId: Yup.object().shape({
          label: Yup.string(),
          value: Yup.number()
        }),
        major: Yup.string()
          .min(4, "Needs at least 4 characters")
          .max(30, "No more than 30 characters")
          .required("Required"),
        instituteName: Yup.string()
          .min(2, "Needs at least 2 characters")
          .max(50, "No more than 50 characters")
          .required("Required"),
        startDate: Yup.date()
          .min("01/01/2000", "Date should be more recent than 01/01/2020")
          .max(new Date(), "Date cannot be greater than today.")
          .required("Required"),
        endDate: Yup.date()
          .min("01/01/2000", "Date should be more recent than 01/01/2020")
          .max(new Date(), "Date cannot be greater than today.")
          .required("Required"),
        GPA: Yup.number()
          .transform(value => (isNaN(value) ? 0 : value))
          .max(4, "GPA should not be greater than 4.0")
          .min(0, "GPA should not be less than 0")
          .nullable(true)
          .required("Required"),
        percentage: Yup.number()
          .transform(value => (isNaN(value) ? 1 : value))
          .max(100, "Percentage should not be greater than 100")
          .min(0, "Percentage should not be less than 100")
          .nullable(true)
          .required("Required")
      })
    )
    .min(1)
});

export default educationProfileValidationSchema;
