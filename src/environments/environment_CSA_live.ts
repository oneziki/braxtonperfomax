// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Build
// ng build --prod --aot --no-sourcemap --environment=csa_live --base-href /peformaxExcellenceCSA/

export const environment = {
  envName: 'csa_live',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://node.pmaxonline.com:3001',
  apiEndPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/setup/import-tool',
  projectPlanUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://www.peformaxcsa.co.za/peformaxPortalData_Live/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/MyMax/',
  recaptcha_key: '6LeuEqwUAAAAAMoam5wHdF0udHIi8DOqfbzmH8E9',

  /* AZURE */
  azureApplicationID: '',
  azureTenantID: '',
  azureRedirectURI: ''
};
