// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envName: 'rma_local',
  production: false,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3002',
  apiEndPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/BusinessController.cfc?method=apiPortal',
  kraEvidenceUploadPoint: '',
  resourceUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/setup/import-tool',
  projectPlanUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_RMA/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LeKEqwUAAAAAN3agShrpbjTZ6ST5-j5TvCPCffk'
};
