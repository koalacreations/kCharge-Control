FROM quay.io/influxdb/influxdb:2.0.0-beta
MAINTAINER Jaimyn Mayer (github@jaimyn.com.au)

RUN apt-get install -y python3 python3-dev python3-pip nginx curl
RUN python3 --version
RUN apt-get clean

# Create some base folders for everything
RUN mkdir -p /src/app && mkdir /src/logs && mkdir /src/logs/nginx && mkdir /src/data

# Copy our requirements across and install dependencies
# Splitting this and copying the full code means we take advantage of the docker cache layers and don't have to
# reinstall everything when the code changes
WORKDIR /src/app
ADD backend/requirements.txt /src/app
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
ADD frontend/.nvmrc /src/app
RUN export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  && nvm install
#ADD frontend/package.json /src/app
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy over the nginx config file
ADD docker/nginx.conf /etc/nginx/nginx.conf

# Add the rest of our code and build it
ADD . /src/app

WORKDIR /src/app/backend/
RUN python3 manage.py collectstatic --noinput

WORKDIR /src/app/frontend
RUN npm ci && npm run build

# Remove node_modules
RUN rm -rf node_modules

VOLUME /src/data
VOLUME /src/logs
WORKDIR /src/app

# Expose the port and run the app
EXPOSE 8000
CMD ["sh", "/src/app/docker/container_start.sh"]
