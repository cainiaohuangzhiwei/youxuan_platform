FROM node:12.18.2-alpine

# ARG build_space=''

# ENV build_space ${build_space}

RUN \
  mkdir -p /usr/src/yx-egg

WORKDIR /usr/src/yx-egg

COPY package.json /usr/src/yx-egg/

RUN npm i cnpm -g --registry=https://registry.npm.taobao.org

RUN \
  cnpm i nodeinstall -g \
  && nodeinstall --install-alinode 5.16.0 

RUN cnpm i --production --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ --registry=http://nexus.weeget.cn/repository/npm-youxuan

COPY . /usr/src/yx-egg

RUN cnpm run build

EXPOSE 7001

CMD npm run start