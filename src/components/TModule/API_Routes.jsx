import { BASE_URL } from "../../api";

// Research Publications Routes
export const getAllRecordsResearch = `${BASE_URL}/teacher/research-pb/all`;
export const getOneRecordsResearch = (username) => {
  return `${BASE_URL}/teacher/research-pb/${username}`;
};
//++++++++++++++++++++++++
export const getRecordResearchByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/research-pb/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsResearch = `${BASE_URL}/teacher/research-pb/create-new`;
export const deleteRecordsResearch = `${BASE_URL}/teacher/research-pb/remove`;
export const updateRecordsResearch = `${BASE_URL}/teacher/research-pb/update`;
export const uploadRecordsResearch = `${BASE_URL}/teacher/research-pb/upload-file`;

// Book publication Routes
export const getAllRecordsBook = `${BASE_URL}/teacher/book-pb/all`;
export const getOneRecordsBook = (username) => {
  return `${BASE_URL}/teacher/book-pb/${username}`;
};
export const getRecordBookByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/book-pb/${T_ID}/${username}`;
};
export const addRecordsBook = `${BASE_URL}/teacher/book-pb/create-new`;
export const deleteRecordsBook = `${BASE_URL}/teacher/book-pb/remove`;
export const updateRecordsBook = `${BASE_URL}/teacher/book-pb/update`;
export const uploadRecordsBook = `${BASE_URL}/teacher/book-pb/upload-file`;

//FacultyConference publication Routes
export const getAllRecordsFaculty = `${BASE_URL}/teacher/faculty-pb/all`;
export const getOneRecordsFaculty = (username) => {
  return `${BASE_URL}/teacher/faculty-pb/${username}`;
};
export const getRecordsFacultyByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/faculty-pb/${T_ID}/${username}`;
};
export const addRecordsFaculty = `${BASE_URL}/teacher/faculty-pb/create-new`;
export const deleteRecordsFaculty = `${BASE_URL}/teacher/faculty-pb/remove`;
export const updateRecordsFaculty = `${BASE_URL}/teacher/faculty-pb/update`;
export const uploadRecordsFaculty = `${BASE_URL}/teacher/faculty-pb/upload-file`;

// Grants Routes
export const getAllRecordsGrants = `${BASE_URL}/teacher/grants/all`;
export const getOneRecordsGrants = (username) => {
  return `${BASE_URL}/teacher/grants/${username}`;
};
//++++++++++++++++++++++++
export const getRecordGrantsByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/grants/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsGrants = `${BASE_URL}/teacher/grants/create-new`;
export const deleteRecordsGrants = `${BASE_URL}/teacher/grants/remove`;
export const updateRecordsGrants = `${BASE_URL}/teacher/grants/update`;
export const uploadRecordsGrants = `${BASE_URL}/teacher/grants/upload-file`;

//Consultancy Report
//++++++++++++++++++++++++
export const getRecordConsultancyByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/cons-rep/${T_ID}/${username}`;
};
//++++++++++++++++++++++++

// Consultancy Report
export const getAllRecordsConsultancy = `${BASE_URL}/teacher/cons-rep/all`;
export const getOneRecordsConsultancy = (username) => {
  return `${BASE_URL}/teacher/cons-rep/${username}`;
};

export const addRecordsConsultancy = `${BASE_URL}/teacher/cons-rep/create-new`;
export const deleteRecordsConsultancy = `${BASE_URL}/teacher/cons-rep/remove`;
export const updateRecordsConsultancy = `${BASE_URL}/teacher/cons-rep/update`;
export const uploadRecordsConsultancy = `${BASE_URL}/teacher/cons-rep/upload-file`;

// Patent Publication Routes
export const getAllRecordsPatent = `${BASE_URL}/teacher/patent-pb/all`;
export const getOneRecordsPatent = (username) => {
  return `${BASE_URL}/teacher/patent-pb/${username}`;
};
export const addRecordsPatent = `${BASE_URL}/teacher/patent-pb/create-new`;
export const deleteRecordsPatent = `${BASE_URL}/teacher/patent-pb/remove`;
export const updateRecordsPatent = `${BASE_URL}/teacher/patent-pb/update`;
export const uploadRecordsPatent = `${BASE_URL}/teacher/patent-pb/upload-file`;

// ConferenceSeminars Routes
export const getAllRecordsConference = `${BASE_URL}/teacher/con-sem/all`;
export const getOneRecordsConference = (username) => {
  return `${BASE_URL}/teacher/con-sem/${username}`;
};
export const addRecordsConference = `${BASE_URL}/teacher/con-sem/create-new`;
export const deleteRecordsConference = `${BASE_URL}/teacher/con-sem/remove`;
export const updateRecordsConference = `${BASE_URL}/teacher/con-sem/update`;
export const uploadRecordsConference = `${BASE_URL}/teacher/con-sem/upload-file`;

// SSTP_FDP_Workshop Attended Routes
export const getAllRecordsAttended = `${BASE_URL}/teacher/sf-ws/all`;
export const getOneRecordsAttended = (username) => {
  return `${BASE_URL}/teacher/sf-ws/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsAttendedByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/sf-ws/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsAttended = `${BASE_URL}/teacher/sf-ws/create-new`;
export const deleteRecordsAttended = `${BASE_URL}/teacher/sf-ws/remove`;
export const updateRecordsAttended = `${BASE_URL}/teacher/sf-ws/update`;
export const uploadRecordsAttended = `${BASE_URL}/teacher/sf-ws/upload-file`;

//  Webinar_Guest_Lecture Routes
export const getAllRecordsWebinar = `${BASE_URL}/teacher/web-guest/all`;
export const getOneRecordsWebinar = (username) => {
  return `${BASE_URL}/teacher/web-guest/${username}`;
};
export const addRecordsWebinar = `${BASE_URL}/teacher/web-guest/create-new`;
export const deleteRecordsWebinar = `${BASE_URL}/teacher/web-guest/remove`;
export const updateRecordsWebinar = `${BASE_URL}/teacher/web-guest/update`;
export const uploadRecordsWebinar = `${BASE_URL}/teacher/web-guest/upload-file`;

//Number_Of_Mous Routes
export const getAllRecordsMous = `${BASE_URL}/teacher/number-of_mous/all`;
export const getOneRecordsMous = (username) => {
  return `${BASE_URL}/teacher/number-of_mous/${username}`;
};
export const addRecordsMous = `${BASE_URL}/teacher/number-of_mous/create-new`;
export const deleteRecordsMous = `${BASE_URL}/teacher/number-of_mous/remove`;
export const updateRecordsMous = `${BASE_URL}/teacher/number-of_mous/update`;
export const uploadRecordsMous = `${BASE_URL}/teacher/number-of_mous/upload-file`;
//++++++++++++++++++++++++
export const getRecordsMousByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/number-of_mous/${T_ID}/${username}`;
};
//++++++++++++++++++++++++

//  Certificate_Courses Routes
export const getAllRecordsCertificate = `${BASE_URL}/teacher/cert-courses/all`;
export const getOneRecordsCertificate = (username) => {
  return `${BASE_URL}/teacher/cert-courses/${username}`;
};

export const addRecordsCertificate = `${BASE_URL}/teacher/cert-courses/create-new`;
export const deleteRecordsCertificate = `${BASE_URL}/teacher/cert-courses/remove`;
export const updateRecordsCertificate = `${BASE_URL}/teacher/cert-courses/update`;
export const uploadRecordsCertificate = `${BASE_URL}/teacher/cert-courses/upload-file`;
export const getRecordsCertificateByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/cert-courses/${T_ID}/${username}`;
};

//  Prof_Affiliations Routes
export const getAllRecordsProfessional = `${BASE_URL}/teacher/prof-aff/all`;
export const getOneRecordsProfessional = (username) => {
  return `${BASE_URL}/teacher/prof-aff/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsProfessionalByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/prof-aff/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsProfessional = `${BASE_URL}/teacher/prof-aff/create-new`;
export const deleteRecordsProfessional = `${BASE_URL}/teacher/prof-aff/remove`;
export const updateRecordsProfessional = `${BASE_URL}/teacher/prof-aff/update`;
export const uploadRecordsProfessional = `${BASE_URL}/teacher/prof-aff/upload-file`;

//  Faculty_as_Resource Routes
export const getAllRecordsResource = `${BASE_URL}/teacher/facultyresource/all`;
export const getOneRecordsResource = (username) => {
  return `${BASE_URL}/teacher/facultyresource/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsResourceByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/facultyresource/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsResource = `${BASE_URL}/teacher/facultyresource/create-new`;
export const deleteRecordsResource = `${BASE_URL}/teacher/facultyresource/remove`;
export const updateRecordsResource = `${BASE_URL}/teacher/facultyresource/update`;
export const uploadRecordsResource = `${BASE_URL}/teacher/facultyresource/upload-file`;

//  Extension_Activity Routes
export const getAllRecordsExtension = `${BASE_URL}/teacher/extension-act/all`;
export const getOneRecordsExtension = (username) => {
  return `${BASE_URL}/teacher/extension-act/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsExtensionByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/extension-act/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsExtension = `${BASE_URL}/teacher/extension-act/create-new`;
export const deleteRecordsExtension = `${BASE_URL}/teacher/extension-act/remove`;
export const updateRecordsExtension = `${BASE_URL}/teacher/extension-act/update`;
export const uploadRecordsExtension = `${BASE_URL}/teacher/extension-act/upload-file`;

//  Techfest_Organized Routes
export const getAllRecordsTechnical = `${BASE_URL}/teacher/techfest-org/all`;
export const getOneRecordsTechnical = (username) => {
  return `${BASE_URL}/teacher/techfest-org/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsTechnicalByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/techfest-org/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsTechnical = `${BASE_URL}/teacher/techfest-org/create-new`;
export const deleteRecordsTechnical = `${BASE_URL}/teacher/techfest-org/remove`;
export const updateRecordsTechnical = `${BASE_URL}/teacher/techfest-org/update`;
export const uploadRecordsTechnical = `${BASE_URL}/teacher/techfest-org/upload-file`;

//  Faculty_Achievements Routes
export const getAllRecordsAchievements = `${BASE_URL}/teacher/faculty-achievement/all`;
export const getOneRecordsAchievements = (username) => {
  return `${BASE_URL}/teacher/faculty-achievement/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsAchievementsByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/faculty-achievement/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsAchievements = `${BASE_URL}/teacher/faculty-achievement/create-new`;
export const deleteRecordsAchievements = `${BASE_URL}/teacher/faculty-achievement/remove`;
export const updateRecordsAchievements = `${BASE_URL}/teacher/faculty-achievement/update`;
export const uploadRecordsAchievements = `${BASE_URL}/teacher/faculty-achievement/upload-file`;

// Industrial_Visits Routes
export const getAllRecordsIndustrial = `${BASE_URL}/teacher/visit-tours/all`;
export const getOneRecordsIndustrial = (username) => {
  return `${BASE_URL}/teacher/visit-tours/${username}`;
};
//++++++++++++++++++++++++
export const getRecordsIndustrialByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/visit-tours/${T_ID}/${username}`;
};
//++++++++++++++++++++++++
export const addRecordsIndustrial = `${BASE_URL}/teacher/visit-tours/create-new`;
export const deleteRecordsIndustrial = `${BASE_URL}/teacher/visit-tours/remove`;
export const updateRecordsIndustrial = `${BASE_URL}/teacher/visit-tours/update`;
export const uploadRecordsIndustrial = `${BASE_URL}/teacher/visit-tours/upload-file`;

//  Contribution_To_BOS Routes
export const getAllRecordsContribution = `${BASE_URL}/teacher/contribution-bos/all`;
export const getOneRecordsContribution = (username) => {
  return `${BASE_URL}/teacher/contribution-bos/${username}`;
};
export const getRecordContributionByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/contribution-bos/${T_ID}/${username}`;
};
export const addRecordsContribution = `${BASE_URL}/teacher/contribution-bos/create-new`;
export const deleteRecordsContribution = `${BASE_URL}/teacher/contribution-bos/remove`;
export const updateRecordsContribution = `${BASE_URL}/teacher/contribution-bos/update`;
export const uploadRecordsContribution = `${BASE_URL}/teacher/contribution-bos/upload-file`;




// Econtent  Routes
export const getAllRecordsEContent = `${BASE_URL}/teacher/e-content/all`;
export const getOneRecordsEContent = (username) => {
  return `${BASE_URL}/teacher/e-content/${username}`;
};
export const getRecordEContentByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/e-content/${T_ID}/${username}`;
};
export const addRecordsEContent = `${BASE_URL}/teacher/e-content/create-new`;
export const deleteRecordsEContent = `${BASE_URL}/teacher/e-content/remove`;
export const updateRecordsEContent = `${BASE_URL}/teacher/e-content/update`;
export const uploadRecordsEContent = `${BASE_URL}/teacher/e-content/upload-file`;


// Examination Work Routes
export const getAllRecordsExaminationWork = `${BASE_URL}/teacher/exam-work/all`;
export const getOneRecordsExaminationWork = (username) => {
  return `${BASE_URL}/teacher/exam-work/${username}`;
};
export const getRecordExaminationWorkByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/exam-work/${T_ID}/${username}`;
};
export const addRecordsExaminationWork = `${BASE_URL}/teacher/exam-work/create-new`;
export const deleteRecordsExaminationWork = `${BASE_URL}/teacher/exam-work/remove`;
export const updateRecordsExaminationWork = `${BASE_URL}/teacher/exam-work/update`;
export const uploadRecordsExaminationWork = `${BASE_URL}/teacher/exam-work/upload-file`;

//Reviewer Routes
export const getAllRecordsReviewer = `${BASE_URL}/teacher/reviewer/all`;
export const getOneRecordsReviewer = (username) => {
  return `${BASE_URL}/teacher/reviewer/${username}`;
};
export const getRecordReviewerByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/reviewer/${T_ID}/${username}`;
};
export const addRecordsReviewer = `${BASE_URL}/teacher/reviewer/create-new`;
export const deleteRecordsReviewer = `${BASE_URL}/teacher/reviewer/remove`;
export const updateRecordsReviewer = `${BASE_URL}/teacher/reviewer/update`;
export const uploadRecordsReviewer = `${BASE_URL}/teacher/reviewer/upload-file`;



//Innovative Teaching Routes
export const getAllRecordsInnovativeTeaching = `${BASE_URL}/teacher/innovative-teaching/all`;
export const getOneRecordsInnovativeTeaching = (username) => {
  return `${BASE_URL}/teacher/innovative-teaching/${username}`;
};
export const getRecordInnovativeTeachingByID = (T_ID, username) => {
  return `${BASE_URL}/teacher/innovative-teaching/${T_ID}/${username}`;
};
export const addRecordsInnovativeTeaching = `${BASE_URL}/teacher/innovative-teaching/create-new`;
export const deleteRecordsInnovativeTeaching = `${BASE_URL}/teacher/innovative-teaching/remove`;
export const updateRecordsInnovativeTeaching = `${BASE_URL}/teacher/innovative-teaching/update`;
export const uploadRecordsInnovativeTeaching = `${BASE_URL}/teacher/innovative-teaching/upload-file`;




