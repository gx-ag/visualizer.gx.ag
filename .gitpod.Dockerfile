FROM gitpod/workspace-full

# install terraform
RUN wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_linux_amd64.zip -O /tmp/terraform.zip
RUN (cd /tmp && unzip terraform.zip)
RUN rm /tmp/terraform.zip
RUN sudo mv /tmp/terraform /usr/bin/

# install aws-cli
RUN sudo curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
RUN sudo (cd /tmp && unzip awscliv2.zip)
RUN sudo /tmp/aws/install
RUN sudo rm -rf /tmp/aws*

# install jq
RUN sudo apt install -y jq