FROM node:4.3.1
MAINTAINER Doriane Kaffo <doriane.tedongmokaffo@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/auditor/

WORKDIR /opt/auditor/
RUN npm install

ENTRYPOINT ["node", "/opt/auditor/auditor.js"]
