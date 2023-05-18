"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAWSAuthHeader = void 0;
const aws4_1 = __importDefault(require("aws4"));
function generateAWSAuthHeader(path) {
    const options = {
        host: `litterae.${'s3'}.${'sa-east-1'}.amazonaws.com`,
        path: path,
        region: 'sa-east-1',
        service: 's3'
    };
    const credentials = {
        accessKeyId: process.env.AWS_ACESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    };
    const signedRequest = aws4_1.default.sign(options, credentials);
    return signedRequest.headers;
}
exports.generateAWSAuthHeader = generateAWSAuthHeader;
