# Hotel Reservation Automation

Selenium + TestNG automation using **Page Object Model (POM)**. Does **NOT** modify the Ocean View Resort application code.

## Project Structure

```
hotel-reservation-automation
├── src
│   ├── main
│   │   └── java
│   │
│   └── test
│       ├── java
│       │   └── com.oceanview.automation
│       │       ├── base
│       │       │     BaseTest.java
│       │       ├── pages
│       │       │     LoginPage.java
│       │       │     RegisterPage.java
│       │       │     ReservationPage.java
│       │       ├── tests
│       │       │     LoginTest.java
│       │       │     ReservationTest.java
│       │       └── utils
│       │             ConfigReader.java
│       │
│       └── resources
│             config.properties
│
├── pom.xml
├── testng.xml
└── README.md
```

## Prerequisites

- Java 17+
- Maven
- Chrome browser
- Backend at `http://localhost:8080`
- Frontend at `http://localhost:5173`

## Run Tests

```bash
# Start app first, then:
cd hotel-reservation-automation
./mvnw test
```

Or with Maven: `mvn test`

Or run TestNG directly from IDE using `testng.xml`.

## Configuration

Edit `src/test/resources/config.properties`:

```properties
base.url=http://localhost:5173
implicit.wait=5
page.load.timeout=15
```
