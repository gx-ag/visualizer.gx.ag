ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# install terraform
RUN wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_linux_amd64.zip -O /tmp/terraform.zip
RUN (cd /tmp && unzip terraform.zip)
RUN rm /tmp/terraform.zip
RUN mv /tmp/terraform /usr/bin/

# install aws-cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
RUN (cd /tmp && unzip awscliv2.zip)
RUN /tmp/aws/install
RUN rm -rf /tmp/aws*

# install jq
RUN apt install -y jq