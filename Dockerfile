FROM ubuntu:16.04

MAINTAINER <Tom S. | thoschulte@gmail.com>

ARG PW_ARG=mama
ENV PW_ENV=$PW_ARG

RUN apt-get update && apt-get install -y nodejs npm

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:'${PW_ENV} | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost || exit 1

EXPOSE 80
CMD ["/usr/sbin/sshd", "-D"]

# VARIABLE_NAME = 'thomas'
# docker build -t thoschu/ssh-container --build-arg PW_ARG=${VARIABLE_NAME} .
