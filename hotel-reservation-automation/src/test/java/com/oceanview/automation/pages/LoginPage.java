package com.oceanview.automation.pages;

import com.oceanview.automation.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;


public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private static final By USERNAME_INPUT = By.cssSelector("input[placeholder*='username']");
    private static final By PASSWORD_INPUT = By.cssSelector("input[type='password']");
    private static final By LOGIN_BUTTON = By.xpath("//form//button[contains(text(),'Login')]");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void open() {
        driver.get(ConfigReader.getBaseUrl() + "/login");
    }

    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));
        driver.findElement(USERNAME_INPUT).clear();
        driver.findElement(USERNAME_INPUT).sendKeys(username);
    }

    public void enterPassword(String password) {
        driver.findElement(PASSWORD_INPUT).clear();
        driver.findElement(PASSWORD_INPUT).sendKeys(password);
    }

    public void clickLogin() {
        driver.findElement(LOGIN_BUTTON).click();
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public boolean isOnLoginPage() {
        return getCurrentUrl().contains("/login");
    }
}
