import React from "react";
import { Formik, FieldArray, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import educationProfileValidationSchema from "./EducationProfileValidationSchema";
import "./UserProfileCard.css";
import PropTypes from "prop-types";

class EducationProfileWizardForm extends React.Component {
  handleToggle = e => {
    e.preventDefault();
    this.props.onClick(e);
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <Formik
            enableReinitialize={true}
            initialValues={this.props.initialValues}
            validationSchema={educationProfileValidationSchema}
          >
            {props => {
              const { values, setFieldValue, isValid } = props;
              if (isValid) {
                this.props.handleData(values, "educationDetails");
              }
              return (
                <Form className="wizard-form">
                  <FieldArray name="educations">
                    {arrayHelpers => (
                      <div>
                        {values.educations && values.educations.length > 0 ? (
                          values.educations.map((education, index) => {
                            this.handleCertificateChange = (
                              value,
                              index,
                              setFieldValue
                            ) => {
                              setFieldValue(
                                `educations[${index}].certificateTypeId`,
                                value
                              );
                            };
                            return (
                              <div key={index}>
                                <div className="wizard-input">
                                  <label htmlFor="certificateTypeId">
                                    Certificate Type
                                  </label>
                                  <Select
                                    name={`educations[${index}].certificateTypeId`}
                                    onChange={value =>
                                      this.handleCertificateChange(
                                        value,
                                        index,
                                        setFieldValue
                                      )
                                    }
                                    options={this.props.mappedCertificates}
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].certificateTypeId`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="major">Major</label>
                                  <Field
                                    name={`educations[${index}].major`}
                                    type="input"
                                    placeholder="Enter Major"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].major`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="instituteName">
                                    Institute Name
                                  </label>
                                  <Field
                                    name={`educations[${index}].instituteName`}
                                    type="text"
                                    placeholder="Enter Name"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].instituteName`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="startDate">Start Date</label>
                                  <Field
                                    name={`educations[${index}].startDate`}
                                    type="date"
                                    placeholder="Enter Start Date"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].startDate`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="endDate">End Date</label>
                                  <Field
                                    name={`educations[${index}].endDate`}
                                    type="date"
                                    placeholder="Enter End Date"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].endDate`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="GPA">GPA</label>
                                  <Field
                                    name={`educations[${index}].GPA`}
                                    type="number"
                                    placeholder="Enter GPA"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].GPA`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="percentage">Percentage</label>
                                  <Field
                                    name={`educations[${index}].percentage`}
                                    type="number"
                                    placeholder="Enter Percentage"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`educations[${index}].percentage`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <hr className="wizard-hr" />
                              </div>
                            );
                          })
                        ) : (
                          <div></div>
                        )}
                        <div className="wizard-input text-center">
                          <button
                            className="m-1 btn p-2 bg-success"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                certificateTypeId: {},
                                major: "",
                                instituteName: "",
                                startDate: "",
                                endDate: "",
                                GPA: 0,
                                percentage: 0
                              })
                            }
                          >
                            Add Education
                          </button>
                          <button
                            className="m-1 btn p-2 bg-danger"
                            type="button"
                            onClick={() => arrayHelpers.pop()}
                          >
                            Remove Education
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <div className="btn-group d-flex" role="group">
                    <button
                      type="button"
                      name="expExpand"
                      className="btn btn-primary btn-sm"
                      disabled={!isValid}
                      onClick={this.handleToggle}
                    >
                      Next
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </React.Fragment>
    );
  }
}

EducationProfileWizardForm.propTypes = {
  initialValues: PropTypes.shape({}),
  mappedCertificates: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  handleData: PropTypes.func,
  onClick: PropTypes.func
};

export default EducationProfileWizardForm;
