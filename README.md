# Admin Portal UI

The Admin Portal UI (admin-portal-ui) is an administrative user interface module of the Consent2Share (C2S) used to create and manage patient accounts. Administrative staff can use this to log in, visit their home page, create patient accounts, and manage patient information.

## Build

### Prerequisites

+ [Oracle Java JDK 8 with Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
+ [Docker Engine](https://docs.docker.com/engine/installation/) (for building a Docker image from the project)
+ [Node.js](https://nodejs.org/en/) (Optional, *see [Structure](#structure) for details*)
+ [Grunt](http://gruntjs.com/getting-started) (Optional, *see [Structure](#structure) for details*)

### Structure

There are two main modules in this project:

+ `client`: This folder contains all frontend user interface code which is written using [Angular](https://angularjs.org/) v1.5.
+ `server`: This folder contains a [Spring Boot](http://projects.spring.io/spring-boot/) project, which is primarily responsible for packaging and serving the static resources that are built from the `client` module. This is also an [Apache Maven](https://maven.apache.org/) project and utilizes [Frontend Maven Plugin](https://github.com/eirslett/frontend-maven-plugin) to: 
    1. locally install [Node.js](https://nodejs.org/en/) and the `client` module Node.js dependencies; 
    2. build the `client` module using locally installed [Grunt](http://gruntjs.com/) Node.js package. Finally, it uses [Apache Maven Resources Plugin](https://maven.apache.org/plugins/maven-resources-plugin/) to copy the resources that are built from the `client` module into the `server` module that will be eventually packaged as a build artifact in `jar` format. Therefore, there is no need to install Node.js or Grunt globally if `server` module is built with Maven.

### Commands

This Maven project requires [Apache Maven](https://maven.apache.org/) 3.3.3 or greater to build it. It is recommended to use the *Maven Wrapper* scripts provided with this project. *Maven Wrapper* requires an internet connection to download Maven and project dependencies for the very first build.

To build the project, navigate to the folder that contains `pom.xml` file using terminal/command line.

+ To build a JAR:
    + For Windows, run `mvnw.cmd clean install`
    + For *nix systems, run `mvnw clean install`
+ To build a Docker Image (this will create an image with `bhits/admin-portal-ui:latest` tag):
    + For Windows, run `mvnw.cmd clean package docker:build`
    + For *nix systems, run `mvnw clean package docker:build`

Note: Frontend developers can build `client` and `server` modules separately and save build time by skipping the full Grunt build when not needed. This option requires [Grunt](http://gruntjs.com/) to be installed globally.
  
1. Build the `client` module: *run `grunt build:dev` in the client folder*
2. Start Grunt watch task to monitor the changes in the `client` module: *run `grunt watch` in the client folder*
3. Manually repackage the `jar` file from the `server` module when Grunt watch re-compiles a resource: *run `mvnw.cmd clean install -PskipGrunt` in the server folder*

## Run

### Commands

This is a [Spring Boot](https://projects.spring.io/spring-boot/) project and serves the project via an embedded Tomcat instance, therefore there is no need for a separate application server to run it.

+ Run as a JAR file: `java -jar admin-portal-ui-x.x.x-SNAPSHOT.jar <additional program arguments>`
+ Run as a Docker Container: `docker run -d bhits/admin-portal-ui:latest <additional program arguments>`

*NOTE: In order for this application to fully function as a microservice in C2S Application, it is also required to setup the dependency microservices and support level infrastructure. Please refer to the C2S Deployment Guide for instructions to setup the C2S infrastructure.*

## Configure

### Server Configuration

The `server` component is primarily responsible for serving the static `client` content. The configuration in `server` module is mostly for C2S infrastructure requirements.

*NOTE: The Admin Portal UI uses [HTML5 mode](https://docs.angularjs.org/guide/$location#html5-mode) for the URL format in the browser address bar and it also uses `/fe` as the base for all Angular routes. Therefore, the `server` component forwards all paths that starts with `/fe` to root.*

In the `AdminUIApplication.java`:
```java
...
  @RequestMapping(value = "/fe/**")
      public String redirect() {
          return "forward:/";
      }
...
```

#### Enable SSL

For simplicity in development and testing environments, SSL is **NOT** enabled by default configuration. SSL can easily be enabled following the examples below:

##### Enable SSL While Running as a JAR

+ `java -jar admin-portal-ui-x.x.x-SNAPSHOT.jar --spring.profiles.active=ssl --server.ssl.key-store=/path/to/ssl_keystore.keystore --server.ssl.key-store-password=strongkeystorepassword`

##### Enable SSL While Running as a Docker Container

+ `docker run -d -v "/path/on/dockerhost/ssl_keystore.keystore:/path/to/ssl_keystore.keystore" bhits/admin-portal-ui:latest --spring.profiles.active=ssl --server.ssl.key-store=/path/to/ssl_keystore.keystore --server.ssl.key-store-password=strongkeystorepassword`
+ In the `docker-compose.yml`, this can be provided as:
```yml
...
  admin-ui.c2s.com:
    image: "bhits/admin-portal-ui:latest"
    command: ["--spring.profiles.active=ssl","--server.ssl.key-store=/path/to/ssl_keystore.keystore", "--server.ssl.key-store-password=strongkeystorepassword"]
    volumes:
      - /path/on/dockerhost/ssl_keystore.keystore:/path/to/ssl_keystore.keystore
...
```

*NOTE: As seen in the examples above, `/path/to/ssl_keystore.keystore` is made available to the container via a volume mounted from the Docker host running this container.*

#### Override Java CA Certificates Store In Docker Environment

Java has a default CA Certificates Store that allows it to trust well-known certificate authorities. For development and testing purposes, one might want to trust additional self-signed certificates. In order to override the default Java CA Certificates Store in Docker container, one can mount a custom `cacerts` file over the default one in the Docker image as `docker run -d -v "/path/on/dockerhost/to/custom/cacerts:/etc/ssl/certs/java/cacerts" bhits/admin-portal-ui:latest`

*NOTE: The `cacerts` references given in the both sides of volume mapping above are files, not directories.*

### Client Configuration

This project runs with some default configuration that is primarily targeted for development environment. You can change the default configuration in the [gruntfile](client/gruntfile.js), but you need to rebuild the project after any changes.

Please see the [default configuration](client/gruntfile.js) as a guidance and adjust the environment specific configurations as needed.

#### Examples for Changing Configuration in Grunt

In the `gruntfile.js`, locate the `dev` environment configuration. After adjusting the configuration as needed, rebuild the project as defined in the [Build](#build) section.

```js
...
  dev: {
      options: {
          dest: '<%= config_dir %>/config.js'
      },
      constants: {
          envService: {
              name: 'Development',
              version:'<%= pkg.version %>',
              base64BasicKey: 'newvalue',
...
```

*NOTE: The `base64BasicKey` value is used for [User Account and Authentication (UAA) Password Grant type](http://docs.cloudfoundry.org/api/uaa/#password-grant). This configuration should be Base 64 encoded `client_id:client_secret` value. The `client_id` refers to the OAuth2 Client ID assigned to the Admin Portal UI by [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html). C2S uses `admin-portal-ui` as the default `client_id` for this application.*

[//]: # (## API Documentation)

[//]: # (## Notes)

[//]: # (## Contribute)

## Contact
If you have any questions, comments, or concerns please see [Consent2Share](../../contact) page

## Report Issues
Please use [GitHub Issues](https://github.com/bhits/admin-portal-ui/issues) page to report issues.

[//]: # (License)