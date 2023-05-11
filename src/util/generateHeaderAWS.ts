import aws4 from 'aws4';

export function generateAWSAuthHeader(path: any) {

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

  const signedRequest = aws4.sign(options, credentials);

  return signedRequest.headers;
}
