// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envName: 'barrick_local',
  production: false,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3002',
  apiEndPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/BusinessController.cfc?method=apiPortal',
  kraEvidenceUploadPoint: '',
  profilePhotoUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/login/ProfilePhotoFileUpload.cfm',
  resourceUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/setup/import-tool',
  projectPlanUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_Barrick/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LeKEqwUAAAAAN3agShrpbjTZ6ST5-j5TvCPCffk',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
