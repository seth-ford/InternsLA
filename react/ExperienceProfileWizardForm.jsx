import React from "react";
import { Formik, FieldArray, Field, Form, ErrorMessage } from "formik";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import Select from "react-select";
import experienceProfileValidationSchema from "./ExperienceProfileValidationSchema";
import "./UserProfileCard.css";

class ExperienceProfileWizardForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <Formik
            enableReinitialize={true}
            initialValues={this.props.initialValues}
            validationSchema={experienceProfileValidationSchema}
            onSubmit={this.props.handlePreview}
          >
            {props => {
              const { values, setFieldValue, isValid, handleSubmit } = props;
              if (isValid) {
                this.props.handleData(values, "experienceDetails");
              }
              return (
                <Form onSubmit={handleSubmit} className="wizard-form">
                  <FieldArray name="experiences">
                    {arrayHelpers => (
                      <div>
                        {values.experiences && values.experiences.length > 0 ? (
                          values.experiences.map((experience, index) => {
                            this.handleStateChange = (
                              value,
                              index,
                              setFieldValue
                            ) => {
                              setFieldValue(
                                `experiences[${index}].state`,
                                value
                              );
                            };
                            this.handleCountryChange = (
                              value,
                              index,
                              setFieldValue
                            ) => {
                              setFieldValue(
                                `experiences[${index}].country`,
                                value
                              );
                            };
                            return (
                              <div key={index}>
                                <div className="wizard-input">
                                  <label htmlFor="startDate">Start Date</label>
                                  <Field
                                    name={`experiences[${index}].startDate`}
                                    type="date"
                                    placeholder="Enter Start Date"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].startDate`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="endDate">End Date</label>
                                  <Field
                                    name={`experiences[${index}].endDate`}
                                    type="date"
                                    placeholder="Enter End Date"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].endDate`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="jobTitle">Job Title</label>
                                  <Field
                                    name={`experiences[${index}].jobTitle`}
                                    type="input"
                                    placeholder="Enter Job Title"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].jobTitle`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="companyName">
                                    Company Name
                                  </label>
                                  <Field
                                    name={`experiences[${index}].companyName`}
                                    type="text"
                                    placeholder="Enter Name"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].companyName`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="city">City</label>
                                  <Field
                                    name={`experiences[${index}].city`}
                                    type="text"
                                    placeholder="Enter City"
                                    component="input"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].city`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="state">State</label>
                                  <Select
                                    name={`experiences[${index}].state`}
                                    onChange={value =>
                                      this.handleStateChange(
                                        value.label,
                                        index,
                                        setFieldValue
                                      )
                                    }
                                    options={this.props.mappedStates}
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].state`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="state">Country</label>
                                  <Select
                                    name={`experiences[${index}].country`}
                                    onChange={value =>
                                      this.handleCountryChange(
                                        value.label,
                                        index,
                                        setFieldValue
                                      )
                                    }
                                    options={this.props.mappedCountries}
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].country`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <div className="wizard-input">
                                  <label htmlFor="description">
                                    Description
                                  </label>
                                  <Field
                                    name={`experiences[${index}].description`}
                                    type="text"
                                    placeholder="Enter Description"
                                    component="textarea"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name={`experiences[${index}].description`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                                <FormGroup className="text-center">
                                  <Field
                                    name={`experiences[${index}].isCurrent`}
                                    type="checkbox"
                                    component="input"
                                    placeholder="isCurrent"
                                    className="form-control-sm"
                                  />
                                  <br />
                                  <label
                                    className="form-check-label"
                                    htmlFor="isCurrent"
                                  >
                                    Current Job
                                  </label>
                                </FormGroup>
                                <hr className="wizard-hr" />
                              </div>
                            );
                          })
                        ) : (
                          <div></div>
                        )}
                        <div className="text-center mb-3">
                          <button
                            className="m-1 p-2 btn bg-success"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                isCurrent: false,
                                startDate: "",
                                endDate: "",
                                jobTitle: "",
                                companyName: "",
                                city: "",
                                state: "",
                                country: "",
                                description: ""
                              })
                            }
                          >
                            Add Experience
                          </button>
                          <button
                            className="m-1 p-2 btn bg-danger"
                            type="button"
                            onClick={() => arrayHelpers.pop()}
                          >
                            Remove Experience
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <div className="btn-group d-flex" role="group">
                    <button
                      type="submit"
                      name="preview"
                      className="btn btn-primary btn-sm"
                      disabled={!isValid}
                    >
                      Preview
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

ExperienceProfileWizardForm.propTypes = {
  initialValues: PropTypes.shape({}),
  mappedStates: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  mappedCountries: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  handleData: PropTypes.func,
  handlePreview: PropTypes.func
};

export default ExperienceProfileWizardForm;
