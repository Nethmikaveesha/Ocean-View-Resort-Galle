package com.oceanview.automation.pages;

import com.oceanview.automation.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.Select;

import java.time.Duration;


public class ReservationPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private static final By GUEST_NAME_INPUT = By.cssSelector("input[name='guestName']");
    private static final By ADDRESS_INPUT = By.cssSelector("input[name='address']");
    private static final By CONTACT_INPUT = By.cssSelector("input[name='contactNumber']");
    private static final By CHECK_IN_INPUT = By.cssSelector("input[name='checkIn']");
    private static final By CHECK_OUT_INPUT = By.cssSelector("input[name='checkOut']");
    private static final By ROOM_TYPE_SELECT = By.cssSelector("select[name='roomType']");
    private static final By ROOM_ID_SELECT = By.cssSelector("select[name='roomId']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(text(),'Complete Reservation')]");

    public ReservationPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void open() {
        driver.get(ConfigReader.getBaseUrl() + "/add-reservation");
    }

    public void enterGuestName(String name) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(GUEST_NAME_INPUT));
        driver.findElement(GUEST_NAME_INPUT).clear();
        driver.findElement(GUEST_NAME_INPUT).sendKeys(name);
    }

    public void enterAddress(String address) {
        driver.findElement(ADDRESS_INPUT).clear();
        driver.findElement(ADDRESS_INPUT).sendKeys(address);
    }

    public void enterContactNumber(String contact) {
        driver.findElement(CONTACT_INPUT).clear();
        driver.findElement(CONTACT_INPUT).sendKeys(contact);
    }

    public void enterCheckIn(String date) {
        driver.findElement(CHECK_IN_INPUT).clear();
        driver.findElement(CHECK_IN_INPUT).sendKeys(date);
    }

    public void enterCheckOut(String date) {
        driver.findElement(CHECK_OUT_INPUT).clear();
        driver.findElement(CHECK_OUT_INPUT).sendKeys(date);
    }

    public void selectRoomType(String roomType) {
        try {
            Select select = new Select(driver.findElement(ROOM_TYPE_SELECT));
            select.selectByVisibleText(roomType);
        } catch (Exception e) {
            // May use different control
        }
    }

    public void selectRoomId(String roomId) {
        try {
            WebDriverWait roomWait = new WebDriverWait(driver, Duration.ofSeconds(5));
            roomWait.until(ExpectedConditions.numberOfElementsToBeMoreThan(ROOM_ID_SELECT, 0));
            Select select = new Select(driver.findElement(ROOM_ID_SELECT));
            select.selectByValue(roomId);
        } catch (Exception e) {
            // Room dropdown may load async
        }
    }

    public void clickSubmit() {
        driver.findElement(SUBMIT_BUTTON).click();
    }

    public void createReservation(String guestName, String address, String contact,
                                  String checkIn, String checkOut, String roomId) {
        enterGuestName(guestName);
        enterAddress(address);
        enterContactNumber(contact);
        enterCheckIn(checkIn);
        enterCheckOut(checkOut);
        if (roomId != null && !roomId.isEmpty()) {
            selectRoomId(roomId);
        }
        clickSubmit();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public boolean isOnReservationPage() {
        return getCurrentUrl().contains("add-reservation") || getCurrentUrl().contains("customer-dashboard");
    }
}
