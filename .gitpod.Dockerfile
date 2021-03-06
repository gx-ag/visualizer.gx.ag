FROM gitpod/workspace-full

# install terraform
RUN wget https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip -O /tmp/terraform.zip
RUN (cd /tmp && unzip terraform.zip)
RUN rm /tmp/terraform.zip
RUN sudo mv /tmp/terraform /usr/bin/

# install aws-cli
RUN sudo apt-get update -y
RUN sudo apt install -y python3-pip && pip3 install awscli

# install jq
RUN sudo apt install -y jq