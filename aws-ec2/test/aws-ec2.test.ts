import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsEc2 from '../lib/aws-ec2-stack';

test('Check InstanceType and SSH KeyName', () => {
    const app = new cdk.App();
    const stack = new AwsEc2.AwsEc2Stack(app, 'MyTestStack');

    expectCDK(stack).to(
      haveResourceLike('AWS::EC2::Instance', {
        InstanceType: 't2.micro',
        KeyName: 'devsecops'
      })
    )
});
