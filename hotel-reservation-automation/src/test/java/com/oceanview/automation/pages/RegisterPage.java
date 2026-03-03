package com.oceanview.automation.pages;

import com.oceanview.automation.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;


public class RegisterPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private static final By NAME_INPUT = By.cssSelector("input[name='name']");
    private static final By ADDRESS_INPUT = By.cssSelector("input[name='address']");
    private static final By CONTACT_INPUT = By.cssSelector("input[name='contactNumber']");
    private static final By USERNAME_INPUT = By.cssSelector("input[name='username']");
    private static final By PASSWORD_INPUT = By.cssSelector("input[name='password']");
    private static final By CREATE_ACCOUNT_BUTTON = By.xpath("//button[contains(text(),'Create Account')]");

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void open() {
        driver.get(ConfigReader.getBaseUrl() + "/register");
    }

    public void enterName(String name) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(NAME_INPUT));
        driver.findElement(NAME_INPUT).clear();
        driver.findElement(NAME_INPUT).sendKeys(name);
    }

    public void enterAddress(String address) {
        driver.findElement(ADDRESS_INPUT).clear();
        driver.findElement(ADDRESS_INPUT).sendKeys(address);
    }

    public void enterContactNumber(String contact) {
        driver.findElement(CONTACT_INPUT).clear();
        driver.findElement(CONTACT_INPUT).sendKeys(contact);
    }

    public void enterUsername(String username) {
        driver.findElement(USERNAME_INPUT).clear();
        driver.findElement(USERNAME_INPUT).sendKeys(username);
    }

    public void enterPassword(String password) {
        driver.findElement(PASSWORD_INPUT).clear();
        driver.findElement(PASSWORD_INPUT).sendKeys(password);
    }

    public void clickCreateAccount() {
        driver.findElement(CREATE_ACCOUNT_BUTTON).click();
    }

    public void register(String name, String address, String contact, String username, String password) {
        enterName(name);
        enterAddress(address);
        enterContactNumber(contact);
        enterUsername(username);
        enterPassword(password);
        clickCreateAccount();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
