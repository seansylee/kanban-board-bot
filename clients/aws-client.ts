import { AWSError, CredentialProviderChain, Credentials, S3 } from 'aws-sdk';
import _ from 'lodash';

function getCredentials(): Promise<Credentials> {
    return new CredentialProviderChain().resolvePromise();
}

export async function getS3Client() {
    const credentials: Credentials = await getCredentials();
    const clientConfiguration: S3.Types.ClientConfiguration = {
        apiVersion: 'latest',
        credentials: credentials        
    };
    const s3 = new S3(clientConfiguration);
    console.log('Got the s3 client.');

    s3.listBuckets((err: AWSError, data: S3.Types.ListBucketsOutput) => {
        if (err) console.error(err, err.stack);
        else console.log(data);
    });
}