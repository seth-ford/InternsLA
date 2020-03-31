import React from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import seekerProfileValidationSchema from "./SeekerProfileValidationSchema";
import { FormGroup } from "reactstrap";
import FileUpload from "../fileUpload/FileUpload";
import Select from "react-select";
import "./UserProfileCard.css";

class SeekerProfileWizardForm extends React.Component {
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
            validationSchema={seekerProfileValidationSchema}
          >
            {props => {
              const { values, setFieldValue, touched, errors, isValid } = props;
              if (isValid) {
                this.props.handleData(values, "seeker");
              }
              return (
                <Form className="wizard-form">
                  <div className="wizard-input">
                    <label htmlFor="currentSalary">Current Salary</label>
                    <Field
                      name="currentSalary"
                      type="number"
                      placeholder="Enter Current Salary"
                      component="input"
                      values={values.currentSalary}
                      className="form-control"
                    />
                    {touched.currentSalary && errors.currentSalary && (
                      <div className="text-danger">{errors.currentSalary}</div>
                    )}
                  </div>
                  <div className="wizard-input">
                    <label htmlFor="currency">Currency</label>
                    <Field
                      name="currency"
                      type="text"
                      placeholder="Enter Currency"
                      component="input"
                      values={values.currency}
                      className="form-control"
                    />
                    {touched.currency && errors.currency && (
                      <div className="text-danger">{errors.currency}</div>
                    )}
                  </div>
                  <FormGroup className="d-flex">
                    <label
                      className="ml-2 mr-3 form-check-label"
                      htmlFor="hasActiveEmailNotification"
                    >
                      Click to activate email notifications.
                    </label>
                    <Field
                      name="hasActiveEmailNotification"
                      type="checkbox"
                      component="input"
                      checked={values.hasActiveEmailNotification}
                      className="form-control-sm"
                    />
                  </FormGroup>
                  {touched.hasActiveEmailNotification &&
                    errors.hasActiveEmailNotification && (
                      <div className="text-danger">
                        {errors.hasActiveEmailNotification}
                      </div>
                    )}
                  <FormGroup className="d-flex">
                    <label
                      className="ml-2 mr-3 form-check-label"
                      htmlFor="isSearchable"
                    >
                      Click to allow other users to find you.
                    </label>
                    <Field
                      name="isSearchable"
                      type="checkbox"
                      component="input"
                      checked={values.isSearchable}
                      className="form-control-sm"
                    />
                  </FormGroup>
                  {touched.isSearchable && errors.isSearchable && (
                    <div className="text-danger">{errors.isSearchable}</div>
                  )}
                  <div className="text-center">
                    <FieldArray name="skills">
                      {arrayHelpers => (
                        <div>
                          {values.skills && values.skills.length > 0 ? (
                            values.skills.map((skill, index) => {
                              this.handleSkillsTypesChange = (
                                value,
                                index,
                                setFieldValue
                              ) => {
                                setFieldValue(
                                  `skills[${index}].skillsTypesId`,
                                  value
                                );
                              };
                              this.handleSkillLevelChange = (
                                value,
                                index,
                                setFieldValue
                              ) => {
                                setFieldValue(
                                  `skills[${index}].skillLevelId`,
                                  value
                                );
                              };
                              return (
                                <div key={index}>
                                  <label htmlFor="skillsTypes">Skills</label>
                                  <Select
                                    name={`skills[${index}].skillsTypesId`}
                                    onChange={value =>
                                      this.handleSkillsTypesChange(
                                        value,
                                        index,
                                        setFieldValue
                                      )
                                    }
                                    options={this.props.mappedSkillsTypes}
                                  />
                                  <label htmlFor="skillLevel">Level</label>
                                  <Select
                                    name={`skills[${index}].skillLevelId`}
                                    onChange={value =>
                                      this.handleSkillLevelChange(
                                        value,
                                        index,
                                        setFieldValue
                                      )
                                    }
                                    options={this.props.mappedSkillLevels}
                                  />
                                  <ErrorMessage
                                    name={`skills[${index}].skillsTypesId`}
                                    component="div"
                                    className="field-error text-danger"
                                  />
                                </div>
                              );
                            })
                          ) : (
                              <div></div>
                            )}
                          <button
                            className="m-1 btn p-2 bg-success"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                skillsTypesId: {},
                                skillLevelId: 1
                              })
                            }
                          >
                            Add Skill
                          </button>
                          <button
                            className="m-1 btn p-2 bg-danger"
                            type="button"
                            onClick={() => arrayHelpers.pop()}
                          >
                            Remove Last Skill
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <label
                    htmlFor="files"
                    className="col-form-label font-weight-bold mt-4"
                  >
                    Files
                  </label>
                  <div className="col-md-9 mb-4">
                    <FileUpload
                      name="files"
                      onUpload={item => {
                        const files = item.map(string => {
                          return {
                            url: string,
                            fileTypeId: 1
                          };
                        });
                        setFieldValue("files", files);
                      }}
                    />
                    {touched.files && errors.files && (
                      <div className="text-danger">{errors.files}</div>
                    )}
                  </div>
                  <div className="btn-group d-flex" role="group">
                    <button
                      type="button"
                      name="educationExpand"
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

SeekerProfileWizardForm.propTypes = {
  initialValues: PropTypes.shape({
    currentSalary: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    hasActiveEmailNotification: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    skills: PropTypes.array.isRequired
  }),
  handleData: PropTypes.func,
  onClick: PropTypes.func,
  skillLevel: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  skillsTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  mappedSkillsTypes: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  mappedSkillLevels: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

export default SeekerProfileWizardForm;