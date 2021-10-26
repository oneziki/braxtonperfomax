// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// ng build --prod --aot --no-sourcemap --environment=braxton_local --base-href /PeformaxPortal_Braxton/

export const environment = {
  envName: 'braxton_local',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3002',
  apiEndPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/setup/import-tool',
  projectPlanUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://peformaxstaging.com/PeformaxPortal_BraxtonData/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/MyMAX_USA/',
  recaptcha_key: '6LeKEqwUAAAAAN3agShrpbjTZ6ST5-j5TvCPCffk',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
