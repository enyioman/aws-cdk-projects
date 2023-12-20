import aws_cdk as core
import aws_cdk.assertions as assertions

from wordpress_app.wordpress_app_stack import WordpressAppStack

# example tests. To run these tests, uncomment this file along with the example
# resource in wordpress_app/wordpress_app_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = WordpressAppStack(app, "wordpress-app")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
