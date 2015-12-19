#CentOS 7
FROM centos:centos7
MAINTAINER Savage Popsicle

#Variables
ENV NVM_VERSION 0.29.0
ENV PATH /root/.nvm/versions/node/v5.0.0/bin:$PATH
ENV NODE_VERSION 5.0.0
ENV NPM_VERSION 3.5.2


#Essential Packages
RUN yum install -y epel-release /
  vim /
  wget

#NVM Installation - uses version variables
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | bash

#Node, NPM installation and update - uses version variables
RUN nvm install $NODE_VERSION
RUN nvm alias default $NODE_VERSION
RUN npm install -g npm@$NPM_VERSION

#Copy Server Files 
WORKDIR /src/
COPY ./src/package.json
RUN cd /src; npm install
COPY ./src /src

# Will run the actual service on the container, will drop into Node REPL
CMD ["node", "server/server.js"] 
