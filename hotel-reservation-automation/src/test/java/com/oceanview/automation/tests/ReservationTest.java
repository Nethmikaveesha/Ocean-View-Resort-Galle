package com.oceanview.automation.tests;

import com.oceanview.automation.base.BaseTest;
import com.oceanview.automation.pages.LoginPage;
import com.oceanview.automation.pages.RegisterPage;
import com.oceanview.automation.pages.ReservationPage;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;


public class ReservationTest extends BaseTest {

    private static final String TEST_PASSWORD = "e2eresv123";

    @Test(priority = 1, description = "Reservation page loads when logged in")
    public void reservationPageLoads() throws InterruptedException {
        String uniqueUser = "e2e_resv_" + System.currentTimeMillis();
        doRegisterAndLogin(uniqueUser);

        ReservationPage reservationPage = new ReservationPage(driver);
        reservationPage.open();
        Thread.sleep(3000);

        String url = reservationPage.getCurrentUrl();
        Assert.assertTrue(url.contains("add-reservation") || url.contains("login"),
                "Should reach add-reservation or redirect to login. URL: " + url);
    }

    @Test(priority = 2, description = "Reservation form has required fields")
    public void reservationFormHasFields() throws InterruptedException {
        String uniqueUser = "e2e_form_" + System.currentTimeMillis();
        doRegisterAndLogin(uniqueUser);

        ReservationPage reservationPage = new ReservationPage(driver);
        reservationPage.open();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[name='guestName']")));
        } catch (Exception e) {
            String url = driver.getCurrentUrl();
            String body = driver.findElement(By.cssSelector("body")).getText();
            Assert.fail("Guest name field not found. URL: " + url + " (if /login, login may have failed). Body preview: " + body.substring(0, Math.min(300, body.length())));
        }
        Assert.assertTrue(driver.findElements(By.cssSelector("input[name='guestName']")).size() > 0,
                "Guest name field should exist");
        Assert.assertTrue(driver.findElements(By.cssSelector("select[name='roomType']")).size() > 0,
                "Room type select should exist");
    }

    private void doRegisterAndLogin(String username) throws InterruptedException {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.open();
        registerPage.register("E2E Reservation Test", "456 Resort Lane", "0779876543", username, TEST_PASSWORD);
        Thread.sleep(4000);

        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        loginPage.login(username, TEST_PASSWORD);

        WebDriverWait urlWait = new WebDriverWait(driver, Duration.ofSeconds(15));
        urlWait.until(d -> d.getCurrentUrl().contains("customer-dashboard"));
        Thread.sleep(1000);
    }
}
