FROM amazon/aws-lambda-nodejs

RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && \
    yum install -y epel-release yum-utils && \
    yum install -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm && \
    yum-config-manager --enable remi-php74 && \
    yum install -y php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysql && \
    yum clean all && \
    rm -rf /var/cache/yum

RUN mkdir /var/task/www
COPY proxy /var/task
COPY www /var/task/www
RUN npm install

CMD ["app.handler"]