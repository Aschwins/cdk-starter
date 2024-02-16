import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, "L3Bucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(expiration),
        },
      ],
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create s3 bucket with L1
    new CfnBucket(this, "L1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 2,
            status: "Enabled",
          },
        ],
      },
    });

    const duration = new cdk.CfnParameter(this, "duration", {
      default: 6,
      type: "Number",
      minValue: 1,
      maxValue: 10,
    });

    // Create s3 bucket with L2
    const L2Bucket = new Bucket(this, "L2Bucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(duration.valueAsNumber),
        },
      ],
    });

    new cdk.CfnOutput(this, "L2BucketName", { value: L2Bucket.bucketName });

    // Create s3 bucket with L3
    new L3Bucket(this, "L3Bucket", 2);
  }
}
