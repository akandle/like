#CentOS 7
FROM centos:centos7
MAINTAINER Savage Popsicle

#Variables
ENV NVM_VERSION 0.29.0
ENV NODE_VERSION 5.0.0
ENV NPM_VERSION 3.5.2


#Essential Packages
RUN yum install -y epel-release vim wget make tar

#NVM Installation - uses version variables
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | bash
ENV PATH /root/.nvm/versions/node/v5.0.0/bin:/root/.nvm:$PATH
#Node, NPM installation and update - uses version variables
RUN source ~/.bashrc && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && npm install -g npm@$NPM_VERSION

#Copy Server Files 
COPY ./src/package.json /src/package.json
RUN cd /src; npm install
COPY ./src /src

# Will run the actual service on the container, will drop into Node REPL
CMD ["node", "server/server.js"] 
