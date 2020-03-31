import React from "react";
import UserProfileWizardForm from "./UserProfileWizardForm";
import SeekerProfileWizardForm from "./SeekerProfileWizardForm";
import EducationProfileWizardForm from "./EducationProfileWizardForm";
import ExperienceProfileWizardForm from "./ExperienceProfileWizardForm";
import UserProfilePreviewForm from "./UserProfilePreviewForm";
import stateService from "../../services/stateService/stateService";
import countryService from "../../services/countryService";
import { lookUp } from "../../services/lookUpService";
import swal from "sweetalert";
import { wizard } from "../../services/userProfileService";

class UserProfileWizard extends React.Component {
  state = {
    wizardData: {
      userData: {
        firstName: "",
        mi: "",
        lastName: "",
        avatarUrl: ""
      },
      seeker: {
        isSearchable: false,
        hasActiveEmailNotification: false,
        currentSalary: 0,
        currency: "",
        skills: []
      },
      educationDetails: {},
      experiencDetails: {}
    },
    userExpand: false,
    seekerExpand: false,
    educationExpand: false,
    expExpand: false,
    preview: false,
    skillsTypes: [],
    skillLevel: [],
    mappedSkillsTypes: [],
    mappedSkillLevels: [],
    mappedCertificates: [],
    mappedStates: [],
    mappedCountries: []
  };
  section = {
    userData: {
      firstName: "",
      mi: "",
      lastName: "",
      avatarUrl: ""
    },
    seeker: {
      isSearchable: false,
      hasActiveEmailNotification: false,
      currentSalary: 0,
      currency: "",
      skills: []
    },
    educationDetails: {},
    experienceDetails: {}
  };

  componentDidMount() {
    lookUp("SkillList")
      .then(this.onGetSkillsSuccess)
      .catch(this.handleLookUpError);
    lookUp("CertificateTypes")
      .then(this.onGetCertificatesSuccess)
      .catch(this.handleLookUpError);
    stateService.getAll().then(this.getAllStateSuccess);
    countryService.getAll().then(this.getAllCountrySuccess);
  }

  onGetSkillsSuccess = response => {
    let skillsTypes = response.items;
    let mappedSkillsTypes = skillsTypes.map(this.mapper);
    lookUp("SkillLevelType").then(levels => {
      let mappedSkillLevels = levels.items.map(this.mapper);
      this.setState(() => {
        return {
          skillLevel: levels.items,
          skillsTypes,
          mappedSkillsTypes,
          mappedSkillLevels
        };
      });
    });
  };

  onGetCertificatesSuccess = response => {
    const mappedCertificates = response.items.map(this.mapper);
    this.setState(() => {
      return { mappedCertificates };
    });
  };

  getAllStateSuccess = response => {
    const mappedStates = response.item.map(this.mapper);
    this.setState(() => {
      return { mappedStates };
    });
  };

  getAllCountrySuccess = response => {
    const mappedCountries = response.item.map(this.mapper);
    this.setState(() => {
      return { mappedCountries };
    });
  };

  handleLookUpError = () => {};

  mapper = data => {
    const result = {
      value: data.id,
      label: data.name
    };
    return result;
  };

  handleToggle = e => {
    let name = e.target.name;
    this.setState(prevState => {
      return {
        ...prevState,
        [name]: !prevState[name]
      };
    });
  };

  handleData = (values, sectionName) => {
    this.section[sectionName] = values;
  };

  handleSubmit = () => {
    this.setState(prevState => {
      if (prevState.preview === true) {
        return {
          ...prevState,
          preview: prevState.preview,
          userExpand: !prevState.userExpand,
          seekerExpand: !prevState.seekerExpand,
          educationExpand: !prevState.educationExpand,
          expExpand: !prevState.expExpand,
          wizardData: this.section
        };
      } else {
        return {
          ...prevState,
          preview: !prevState.preview,
          userExpand: !prevState.userExpand,
          seekerExpand: !prevState.seekerExpand,
          educationExpand: !prevState.educationExpand,
          expExpand: !prevState.expExpand,
          wizardData: this.section
        };
      }
    });
  };

  handleFinalSubmit = e => {
    const values = this.massage(e);
    wizard(values)
      .then(this.onSubmitSuccess)
      .catch(this.onSubmitError);
  };

  onSubmitSuccess = () => {
    swal("Congrats!", "New user profile created.", "success");
  };

  onSubmitError = () => {
    swal("Sorry!", "New user profile not created.", "error");
  };

  massage = user => {
    const userData = user.userData;
    const edData = user.educationDetails.educations;
    const workData = user.experienceDetails.experiences;
    const jobSeeker = user.seeker;
    const skillsArr = jobSeeker.skills.map(skill => {
      return {
        skillId: skill.skillsTypesId.value,
        skillLevelId: skill.skillLevelId.value
      };
    });
    const edArr = edData.map(ed => {
      return {
        certificateTypeId: ed.certificateTypeId.value,
        major: ed.major,
        instituteName: ed.instituteName,
        startDate: ed.startDate,
        endDate: ed.endDate,
        GPA: (ed.GPA = ed.GPA === "" ? null : ed.GPA),
        percentage: (ed.percentage =
          ed.percentage === "" ? null : ed.percentage)
      };
    });
    const expArr = workData.map(exp => {
      return {
        isCurrent: exp.isCurrent,
        startDate: exp.startDate,
        endDate: exp.endDate,
        jobTitle: exp.jobTitle,
        companyName: exp.companyName,
        city: exp.city,
        state: exp.state,
        country: exp.country,
        description: exp.description
      };
    });
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      mi: userData.mi,
      avatarUrl: userData.avatarUrl,
      educationDetails: edArr,
      experienceDetails: expArr,
      seeker: {
        isSearchable: jobSeeker.isSearchable,
        hasActiveEmailNotification: jobSeeker.hasActiveEmailNotification,
        currentSalary: (jobSeeker.currentSalary =
          jobSeeker.currentSalary === "" ? null : jobSeeker.currentSalary),
        currency: jobSeeker.currency,
        skills: skillsArr,
        files: jobSeeker.files
      }
    };
  };

  render() {
    return (
      <React.Fragment>
        <div className="row pt-4">
          <div className="col-md-6 ml-2">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0 text-center">
                  <button
                    className="btn btn-link font-weight-bolder"
                    type="button"
                    name="userExpand"
                    onClick={this.handleToggle}
                  >
                    User Profile
                  </button>
                </h5>
              </div>
              {this.state.userExpand && (
                <UserProfileWizardForm
                  initialValues={this.state.wizardData.userData}
                  handleToggle={this.handleToggle}
                  handleData={this.handleData}
                  onClick={this.handleToggle}
                />
              )}
            </div>
            <div className="card z-depth-0 bordered">
              <div className="card-header">
                <h5 className="mb-0 text-center">
                  <button
                    className="btn btn-link font-weight-bolder"
                    type="button"
                    name="seekerExpand"
                    onClick={this.handleToggle}
                  >
                    Job Seeker Profile
                  </button>
                </h5>
              </div>
              {this.state.seekerExpand && (
                <SeekerProfileWizardForm
                  initialValues={this.state.wizardData.seeker}
                  handleToggle={this.handleToggle}
                  handleData={this.handleData}
                  onClick={this.handleToggle}
                  skillLevel={this.state.skillLevel}
                  skillsTypes={this.state.skillsTypes}
                  mappedSkillsTypes={this.state.mappedSkillsTypes}
                  mappedSkillLevels={this.state.mappedSkillLevels}
                />
              )}
            </div>
            <div className="card z-depth-0 bordered">
              <div className="card-header text-center">
                <h5 className="mb-0">
                  <button
                    className="btn btn-link font-weight-bolder"
                    type="button"
                    name="educationExpand"
                    onClick={this.handleToggle}
                  >
                    Education Details
                  </button>
                </h5>
              </div>
              {this.state.educationExpand && (
                <EducationProfileWizardForm
                  initialValues={this.state.wizardData.educationDetails}
                  handleToggle={this.handleToggle}
                  handleData={this.handleData}
                  onClick={this.handleToggle}
                  mappedCertificates={this.state.mappedCertificates}
                />
              )}
            </div>
            <div className="card z-depth-0 bordered">
              <div className="card-header text-center">
                <h5 className="mb-0">
                  <button
                    className="btn btn-link font-weight-bolder"
                    type="button"
                    name="expExpand"
                    onClick={this.handleToggle}
                  >
                    Experience Details
                  </button>
                </h5>
              </div>
              {this.state.expExpand && (
                <ExperienceProfileWizardForm
                  initialValues={this.state.wizardData.experiencDetails}
                  handleToggle={this.handleToggle}
                  handleData={this.handleData}
                  handlePreview={this.handleSubmit}
                  onClick={this.handleToggle}
                  mappedStates={this.state.mappedStates}
                  mappedCountries={this.state.mappedCountries}
                />
              )}
            </div>
          </div>
          <div className="col-md-4 ml-2">
            {this.state.preview && (
              <UserProfilePreviewForm
                values={this.state.wizardData}
                onClick={this.handleFinalSubmit}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfileWizard;
