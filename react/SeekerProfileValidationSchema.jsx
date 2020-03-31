import * as Yup from "yup";

Yup.addMethod(Yup.array, "unique", function(message, mapper = a => a) {
  return this.test("unique", message, function(list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

const seekerProfileValidationSchema = Yup.object().shape({
  currentSalary: Yup.number()
    .min(0, "Salary must be greater than 0")
    .nullable(true),
  currency: Yup.string()
    .min(3, "The currency is Invalid")
    .nullable(true)
    .required("Required"),
  hasActiveEmailNotification: Yup.boolean().required("Required"),
  isSearchable: Yup.boolean().required("Required"),
  skills: Yup.array()
    .of(
      Yup.object().shape({
        skillsTypesId: Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.number()
          })
          .required(),
        skillLevelId: Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.number()
          })
          .required()
      })
    )
    .min(3, "Please enter at least 3 skills")
    .unique("Duplicate skill", a => a.skillsTypesId.value),
  files: Yup.array()
    .of(
      Yup.object().shape({
        url: Yup.string()
          .url()
          .required("Required")
      })
    )
    .min(1)
    .required("Required")
});

export default seekerProfileValidationSchema;
