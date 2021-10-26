// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// ng build --configuration=production_barrick_staging --base-href /

export const environment = {
  envName: 'ndb_staging',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://nodestaging.pmaxonline.com:3002',
  apiEndPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/setup/import-tool',
  projectPlanUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://ndbstaging.pmaxonline.com/peformaxPortalData/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LfAEqwUAAAAAGXRN2tGFDKNB0wncVPqLLyGP7q0',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
