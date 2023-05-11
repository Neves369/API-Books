"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAWSAuthHeader = void 0;
const aws4_1 = __importDefault(require("aws4"));
function generateAWSAuthHeader() {
    const options = {
        host: `litterae.${'s3'}.${'sa-east-1'}.amazonaws.com`,
        path: '/1984/teste.epub',
        region: 'sa-east-1',
        service: 's3'
    };
    const credentials = {
        accessKeyId: 'AKIA4AZTEZETP6KV4O56',
        secretAccessKey: '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'
    };
    const signedRequest = aws4_1.default.sign(options, credentials);
    return signedRequest;
}
exports.generateAWSAuthHeader = generateAWSAuthHeader;
