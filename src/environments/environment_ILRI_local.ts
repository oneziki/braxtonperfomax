// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envName: 'ilri_local',
  production: false,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3002',
  apiEndPoint: 'http://localhost/peformaxPortalData_ILRI/BusinessController.cfc?method=apiPortal',
  kraEvidenceUploadPoint: 'http://localhost/peformaxPortalData_ILRI/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'http://localhost/peformaxPortalData_ILRI/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'http://localhost/peformaxPortalData_ILRI/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'http://localhost/peformaxPortalData_ILRI/setup/import-tool',
  projectPlanUploadPoint: 'http://localhost/peformaxPortalData_ILRI/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'http://localhost/peformaxPortalData_ILRI/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/PeformaxPortal_BraxtonData/',
  recaptcha_key: '6LcnCawUAAAAAJCvkdEd4IU4CYy2KgnCCPXh-AZS',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
