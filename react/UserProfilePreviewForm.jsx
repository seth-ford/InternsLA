import React from "react";
import "./UserProfileCard.css";
import PropTypes from "prop-types";
import { FaCheck, FaRegTimesCircle } from "react-icons/fa";

const UserProfilePreviewForm = props => {
  const userData = props.values.userData;
  const seeker = props.values.seeker;
  const educationDetails = props.values.educationDetails;
  const experienceDetails = props.values.experienceDetails;

  const handleFinalSubmit = e => {
    e.preventDefault();
    props.onClick(props.values);
  };

  return (
    <React.Fragment>
      <div className="mb-5 text-center maincard">
        <div className="card-body">
          <img
            className="rounded-circle thumb64 mb-2"
            src={
              userData.avatarUrl
                ? userData.avatarUrl
                : "http://themicon.co/theme/angle/v4.3/reactjs/img/user/02.jpg"
            }
            alt="User avatar"
          />
          <h3 className="m-0 text-bold">
            {userData.firstName ? userData.firstName : "First Name"}{" "}
            {userData.mi ? userData.mi : "Middle Initials"}{" "}
            {userData.lastName ? userData.lastName : "Last Name"}
          </h3>
          <div className="seeker-info">
            <div className="text-bold mr-1">
              Are you searchable?
              <a className="ml-1">
                {seeker.isSearchable ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaRegTimesCircle className="text-danger" />
                )}
              </a>
            </div>
            <div className="text-bold mr-1">
              Active Email Notifications?
              <a className="ml-1">
                {seeker.hasActiveEmailNotification ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaRegTimesCircle className="text-danger" />
                )}
              </a>
            </div>
            <div className="text-bold mr-1">
              Current Salary:
              <a className="ml-1">
                {seeker.currentSalary
                  ? `${seeker.currentSalary} ${seeker.currency}`
                  : "No salary disclosed."}
              </a>
            </div>
          </div>
          <div className="section mt-2">
            <h5 className="skills-title text-bold">Skills:</h5>
            <div className="ml-1">
              {seeker.skills.map((skill, index) => {
                return (
                  <div className="row" key={index}>
                    <div className="col text-bold">{`${skill.skillsTypesId.label}  `}</div>

                    <div className="col">{`${skill.skillLevelId.label}`}</div>
                  </div>
                );
              })}
            </div>
            <div className="education-title text-bold mt-2">Education:</div>
            <div className="education-info">
              {educationDetails.educations.map((education, index) => {
                return (
                  <div className="row" key={index}>
                    <div className="col m-1">
                      <div className="mr-1">
                        <strong>Degree: </strong>
                        {`${education.certificateTypeId.label}`}
                      </div>
                      <div className="mr-1">
                        <strong>Institution: </strong>
                        {`${education.instituteName}`}
                      </div>
                      <div className="mr-1">
                        <strong>Major: </strong> {`${education.major}`}
                      </div>
                      <div className="mr-1">
                        <strong>GPA: </strong>
                        {education.GPA
                          ? `${education.GPA}`
                          : "GPA not disclosed."}
                      </div>
                      <div className="mr-1">
                        <strong>Percentage: </strong>
                        {education.percentage
                          ? `${education.percentage}`
                          : "Percentage not disclosed."}
                      </div>
                    </div>
                    <div className="col m-1">
                      <strong>Dates: </strong>
                      {`${education.startDate} - ${education.endDate}`}
                    </div>
                  </div>
                );
              })}

              <div className="experiences-title text-bold mt-2">
                Work Experience:
              </div>
              <div className="experiences-info">
                {experienceDetails.experiences.map((experience, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col m-1">
                        <div className="mr-1">
                          <strong>Employer: </strong>
                          {`${experience.companyName}`}
                        </div>
                        <div className="mr-1">
                          <strong>Job Title: </strong>
                          {`${experience.jobTitle}`}
                        </div>
                        <div className="mr-1">
                          <strong>Location: </strong>
                          {`${experience.city}, ${experience.state}, ${experience.country}`}
                        </div>
                      </div>
                      <div className="col mr-1">
                        <div className="mr-1">
                          <strong>Dates: </strong>
                          {`${experience.startDate} - ${experience.endDate}`}
                        </div>
                        <div className="text-bold mr-1">
                          Current Job?:
                          <a className="ml-1">
                            {experience.isCurrent ? (
                              <FaCheck className="text-success" />
                            ) : (
                              <FaRegTimesCircle className="text-danger" />
                            )}
                          </a>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col mr-1">
                          <div className="mr-1">
                            <strong>Description: </strong>
                            {`${experience.description}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="btn-group" role="group">
            <button
              type="submit"
              name="final"
              className="btn bg-success btn-sm"
              onClick={handleFinalSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

UserProfilePreviewForm.propTypes = {
  values: PropTypes.shape({
    userData: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired
    }),
    seeker: PropTypes.shape({
      currentSalary: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      hasActiveEmailNotification: PropTypes.bool.isRequired,
      isSearchable: PropTypes.bool.isRequired,
      skills: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.isRequired,
          name: PropTypes.string,
          skillLevelId: PropTypes.isRequired
        })
      )
    }),
    educationDetails: PropTypes.shape({
      educations: PropTypes.arrayOf(PropTypes.shape({}))
    }),
    experienceDetails: PropTypes.shape({
      experiences: PropTypes.arrayOf(PropTypes.shape({}))
    })
  }),
  onClick: PropTypes.func
};

export default UserProfilePreviewForm;
