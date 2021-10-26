// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envName: 'csa_local',
  production: true,
  offline: false,
  realTimeEndPoint: 'https://node.pmaxonline.com:3002',
  offlineSyncServer: 'https://admin:admin@192.168.3.26:6984',
  apiEndPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/BusinessController.cfc?method=apiPortal',
  kraEvidenceUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/setup/import-tool',
  profilePhotoUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/login/ProfilePhotoFileUpload.cfm',
  personalDocumentUploadPoint: 'https://peformaxstaging.com/peformaxPortalData_CSA/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/MyMAX_CSA/',
  recaptcha_key: '6LeKEqwUAAAAAN3agShrpbjTZ6ST5-j5TvCPCffk',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
