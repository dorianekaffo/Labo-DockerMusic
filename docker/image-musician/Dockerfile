FROM node:4.3.1
MAINTAINER Doriane Kaffo <doriane.tedongmokaffo@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/musician/

WORKDIR /opt/musician/
RUN npm install
RUN npm install uuid --save

ENTRYPOINT ["node", "/opt/musician/musician.js"]