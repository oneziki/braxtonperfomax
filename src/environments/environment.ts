//
//  PLEASE DO NOT DELETE THE FOLLOWING KEYS
//

/* RECAPTCHA KEYS

Localhost Invisible
6LcnCawUAAAAAJCvkdEd4IU4CYy2KgnCCPXh-AZS

peformaxstaging.com Invisible
6LeKEqwUAAAAAN3agShrpbjTZ6ST5-j5TvCPCffk

peformaxcsa.co.za Invisible
6LeuEqwUAAAAAMoam5wHdF0udHIi8DOqfbzmH8E9

pmaxonline.com Invisible
6LfAEqwUAAAAAGXRN2tGFDKNB0wncVPqLLyGP7q0

*/

export const environment = {
  envName: 'barrick_staging',
  production: true,
  offline: false,
  offlineSyncServer: '',
  realTimeEndPoint: 'https://nodestaging.pmaxonline.com:3002',
  apiEndPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/BusinessController.cfc?method=apiPortal',
  profilePhotoUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/login/ProfilePhotoFileUpload.cfm',
  kraEvidenceUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/kra/KraScoringEvidenceFileUpload.cfm',
  resourceUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/setup/ResourceFileUpload.cfm',
  performanceDiscussionUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/kra/KraScoringDiscussionFileUpload.cfm',
  importToolUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/setup/import-tool',
  projectPlanUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/setup/ProjectPlanTemplateUpload.cfm',
  personalDocumentUploadPoint: 'https://barrickstaging.pmaxonline.com/peformaxPortalData/setup/UserPersonalDocumentsUpload.cfm',
  baseRef: '/',
  recaptcha_key: '6LcnCawUAAAAAJCvkdEd4IU4CYy2KgnCCPXh-AZS',

  azureApplicationID: '73744728-3ca1-4af0-ae83-b6cb3a473f3c',
  azureTenantID: 'https://login.microsoftonline.com/77b6968b-319c-4b59-9fc4-640f97b70c88',
  azureRedirectURI: 'http://localhost:8100/' 
};