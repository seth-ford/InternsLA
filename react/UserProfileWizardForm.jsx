import React from "react";
import { Formik, FastField, Form } from "formik";
import UserProfileValidationSchema from "./UserProfileValidationSchema";
import "./UserProfileCard.css";
import PropTypes from "prop-types";

class UserProfileWizardForm extends React.Component {
  handleToggle = e => {
    e.preventDefault();
    this.props.onClick(e);
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <Formik
            initialValues={this.props.initialValues}
            enableReinitialize={true}
            validationSchema={UserProfileValidationSchema}
          >
            {props => {
              const { values, touched, errors, isValid } = props;
              if (isValid) {
                this.props.handleData(values, "userData");
              }
              return (
                <Form className="wizard-from">
                  <div className="wizard-input">
                    <label htmlFor="firstName">First Name</label>
                    <FastField
                      name="firstName"
                      placeholder="Enter First Name"
                      component="input"
                      values={values.firstName}
                      className="form-control"
                    />
                    {touched.firstName && errors.firstName && (
                      <div className="text-danger">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="wizard-input">
                    <label htmlFor="mi">Middle Initials</label>
                    <FastField
                      name="mi"
                      placeholder="Enter Middle Initials"
                      component="input"
                      values={values.mi}
                      className="form-control"
                    />
                    {touched.mi && errors.mi && (
                      <div className="text-danger">{errors.mi}</div>
                    )}
                  </div>
                  <div className="wizard-input">
                    <label htmlFor="lastName">Last Name</label>
                    <FastField
                      name="lastName"
                      placeholder="Enter Last Name"
                      component="input"
                      values={values.lastName}
                      className="form-control"
                    />
                    {touched.lastName && errors.lastName && (
                      <div className="text-danger">{errors.lastName}</div>
                    )}
                  </div>
                  <div className="wizard-input">
                    <label htmlFor="avatarUrl">Avatar URL</label>
                    <FastField
                      name="avatarUrl"
                      placeholder="Enter Avatar URL"
                      component="input"
                      values={values.avatarUrl}
                      className="form-control"
                    />
                    {touched.avatarUrl && errors.avatarUrl && (
                      <div className="text-danger">{errors.avatarUrl}</div>
                    )}
                  </div>
                  <div className="btn-group d-flex" role="group">
                    <button
                      type="button"
                      name="seekerExpand"
                      className="btn btn-primary btn-sm mb-2"
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

UserProfileWizardForm.propTypes = {
  initialValues: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired
  }),
  handleData: PropTypes.func,
  handleToggle: PropTypes.func,
  onClick: PropTypes.func
};

export default UserProfileWizardForm;
