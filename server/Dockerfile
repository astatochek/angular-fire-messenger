FROM openjdk:18
LABEL maintainer = "messengerapp"
ADD target/keycloak-test-0.0.1-SNAPSHOT.jar keycloak-test-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "keycloak-test-0.0.1-SNAPSHOT.jar"]