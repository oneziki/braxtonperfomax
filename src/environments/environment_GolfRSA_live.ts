// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Build
// ng build --prod --aot --no-sourcemap --environment=GolfRSA_live --base-href /

export const environment = {
  envName: 'GolfRSA_live',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3001',
  apiEndPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/setup/import-tool',
  projectPlanUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://golfrsa.pmaxonline.com/peformaxPortalData/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LfAEqwUAAAAAGXRN2tGFDKNB0wncVPqLLyGP7q0',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
