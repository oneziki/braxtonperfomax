// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Build
// ng build --configuration=production_braxton_staging --base-href /

export const environment = {
  envName: 'braxton_staging',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://nodestaging.pmaxonline.com:3002',
  apiEndPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://PeformaxExcellence.pmaxonline.com/peformaxPortalData/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/setup/import-tool',
  projectPlanUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://PeformaxExcellenceStaging.pmaxonline.com/peformaxPortalData/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LfAEqwUAAAAAGXRN2tGFDKNB0wncVPqLLyGP7q0',

  /* AZURE */
  azureApplicationID: '0a5981f8-430c-4254-85fe-3fcf98c409a6',
  azureTenantID: 'https://login.microsoftonline.com/77b6968b-319c-4b59-9fc4-640f97b70c88',
  azureRedirectURI: 'https://p7staging.pmaxonline.com/' 
};
