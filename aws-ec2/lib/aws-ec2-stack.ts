import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as fs from 'fs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

require('dotenv').config()

const config = {
  env: {
    account: '335081657283',
    region: 'us-east-1'
  }
}

export class AwsEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: config.env })

    // Get the default VPC. This is the network where your instance will be provisioned
    // All activated regions in AWS have a default vpc. 
    // You can create your own of course as well. https://aws.amazon.com/vpc/
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // Lets create a role for the instance
    // You can attach permissions to a role and determine what your
    // instance can or can not do
      const role = new iam.Role(
        this,
        'simple-instance-1-role', // this is a unique id that will represent this resource in a Cloudformation template
        { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
      )

    // lets create a security group for our instance
    // A security group acts as a virtual firewall for your instance to control inbound and outbound traffic.
    const securityGroup = new ec2.SecurityGroup(
      this,
      'simple-instance-1-sg',
      {
        vpc: defaultVpc,
        allowAllOutbound: true, // will let your instance send outboud traffic
        securityGroupName: 'simple-instance-1-sg',
      }
    )

    // lets use the security group to allow inbound traffic on specific ports
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allows SSH access from Internet'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allows HTTP access from Internet'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allows HTTPS access from Internet'
    )

    // Finally lets provision our ec2 instance
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
    });

    const instance = new ec2.Instance(this, 'simple-instance-1', {
      vpc: defaultVpc,
      role,
      securityGroup,
      instanceName: 'simple-instance-1',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ami,
      keyName: 'devsecops',
    });

    // add user script to instance
    // this script runs when the instance is started 
    const userDataScript = fs.readFileSync('lib/user_script.sh', 'utf8');
    console.log('UserData Script:', userDataScript);
    instance.addUserData(userDataScript);


    // cdk lets us output properties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new cdk.CfnOutput(this, 'simple-instance-1-output', {
      value: instance.instancePublicIp
    })
  }
}
