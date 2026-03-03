package com.oceanview.automation.tests;

import com.oceanview.automation.base.BaseTest;
import com.oceanview.automation.pages.LoginPage;
import com.oceanview.automation.pages.RegisterPage;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;


public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "Login page loads")
    public void loginPageLoads() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        Assert.assertTrue(loginPage.isOnLoginPage(), "Should be on login page");
    }

    @Test(priority = 2, description = "Invalid credentials show error")
    public void invalidCredentialsShowsError() throws InterruptedException {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        loginPage.login("invalid_user_xyz", "wrongpassword");
        Thread.sleep(3000);
        String body = driver.findElement(By.cssSelector("body")).getText().toLowerCase();
        boolean hasError = body.contains("invalid") || body.contains("error") || body.contains("incorrect")
                || body.contains("credentials") || body.contains("password");
        boolean stillOnLogin = loginPage.getCurrentUrl().contains("/login");
        Assert.assertTrue(hasError || stillOnLogin,
                "Should show error or stay on login. Body: " + body.substring(0, Math.min(200, body.length())));
    }

    @Test(priority = 3, description = "Register then Login reaches dashboard")
    public void registerThenLoginReachesDashboard() throws InterruptedException {
        String uniqueUser = "e2e_login_" + System.currentTimeMillis();
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.open();
        registerPage.register("E2E Test User", "123 Test St", "0771234567", uniqueUser, "testpass123");
        Thread.sleep(4000);

        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        loginPage.login(uniqueUser, "testpass123");

        WebDriverWait urlWait = new WebDriverWait(driver, Duration.ofSeconds(15));
        urlWait.until(d -> d.getCurrentUrl().contains("customer-dashboard"));
        Assert.assertTrue(loginPage.getCurrentUrl().contains("customer-dashboard"),
                "Should redirect to customer dashboard");
    }
}
