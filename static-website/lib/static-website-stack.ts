import * as cdk from '@aws-cdk/core';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
// import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create s3 bucket
    const bucket = new s3.Bucket(this, "static-website-bucket", {
      bucketName: "cdk-simply-serverless-ts",
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
    })


    //Deploy the code
    const deployment = new s3Deploy.BucketDeployment(this, "BucketDeploy", {
      sources: [s3Deploy.Source.asset("./build")],
      destinationBucket: bucket,
    })

    // example resource
    // const queue = new sqs.Queue(this, 'StaticWebsiteQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
