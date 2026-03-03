package com.oceanview.automation.utils;

import java.io.InputStream;
import java.util.Properties;

/**
 * Reads test configuration. Does NOT modify application code.
 */
public class ConfigReader {
    private static final String CONFIG_FILE = "config.properties";
    private static Properties props;

    static {
        props = new Properties();
        try (InputStream is = ConfigReader.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (is != null) {
                props.load(is);
            }
        } catch (Exception e) {
            // Use defaults
        }
    }

    public static String getBaseUrl() {
        return props.getProperty("base.url", "http://localhost:5173");
    }

    public static long getImplicitWaitSeconds() {
        return Long.parseLong(props.getProperty("implicit.wait", "5"));
    }

    public static long getPageLoadTimeoutSeconds() {
        return Long.parseLong(props.getProperty("page.load.timeout", "15"));
    }
}
