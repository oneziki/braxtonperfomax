import { Headers, RequestOptions } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

/*
    This class contain environmental values + handling encryption
*/

export class AppSettings {

    public static get API_HEADER_OPTIONS(): RequestOptions {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return options;
    }

    public static get FILE_UPLOAD_ENDPOINT(): string {
        return environment.kraEvidenceUploadPoint;
    }

    public static get IMPORT_TOOL_FILE_UPLOAD_ENDPOINT(): string {
        return environment.importToolUploadPoint;
    }

    public static get DISCUSSION_FILE_UPLOAD_ENDPOINT(): string {
        return environment.performanceDiscussionUploadPoint;
    }

    public static get API_ENDPOINT(): string {
        return environment.apiEndPoint;
    }

    public static get PHOTO_UPLOAD_ENDPOINT(): string {
        return environment.profilePhotoUploadPoint;
    }

    public static get RESOURCE_UPLOAD_ENDPOINT(): string {
        return environment.resourceUploadPoint;
    }

    public static get PROJECT_PLAN_FILE_UPLOAD_ENDPOINT(): string {
        return environment.projectPlanUploadPoint;
    }

    public static get PERSONAL_DOCUMENTS_UPLOAD_ENDPOINT(): string {
        return environment.personalDocumentUploadPoint;
    }

    public static get RECAPTCHA_KEY(): string {
        return environment.recaptcha_key;
    }
    //
    // OFFLINE
    //
    public static get OFFLINE_STATUS(): boolean {
        return environment.offline;
    }

    public static get OFFLINE_SERVER(): string {
        return environment.offlineSyncServer + '/' + environment.envName + '_peformaxdb';
    }

    public static get ENVIRONMENT_NAME(): string {
        return environment.envName;
    }

    public static get PEFORMAX_TOKEN(): string {
        return '33F5B138-3DCA-4E06-A476-6202A603EC5F';
    }

    public static get ENCRYPTION_KEY(): string {
        return 'iq2Dg4jHeSWk6b8nMUCHHg==';
    }

    public static get INITIALIZATIONVECTOR_KEY(): string {
        return 'zfPEeuCSjdk+yc4Xt8Aqew==';
    }

    public static getDecryptedValues(coldfusionEncryptedValue: string): string {

        const base64Key = CryptoJS.enc.Base64.parse(this.ENCRYPTION_KEY);
        const iv = CryptoJS.enc.Base64.parse(this.INITIALIZATIONVECTOR_KEY);
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(coldfusionEncryptedValue) });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, base64Key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    public static getEncryptedValues(sValue: string): string {

        const base64Key = CryptoJS.enc.Base64.parse(this.ENCRYPTION_KEY);
        const iv = CryptoJS.enc.Base64.parse(this.INITIALIZATIONVECTOR_KEY);
        const encrypted = CryptoJS.AES.encrypt(sValue, base64Key, { iv: iv });
        return encrypted;
    }

    public static get NEW_GUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // eslint-disable-next-line
            // eslint-disable-next-line no-bitwise
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



}
