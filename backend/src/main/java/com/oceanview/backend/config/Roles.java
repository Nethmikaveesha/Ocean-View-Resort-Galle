package com.oceanview.backend.config;

/**
 * Centralized role constants to avoid typos between frontend and backend.
 */
public final class Roles {

    private Roles() {}

    // Spring Security expects ROLE_ prefix for hasRole()
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_MANAGER = "ROLE_MANAGER";
    public static final String ROLE_RECEPTIONIST = "ROLE_RECEPTIONIST";
    public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";

    // Raw role values (used in JWT response, DB storage)
    public static final String ADMIN = "ADMIN";
    public static final String MANAGER = "MANAGER";
    public static final String RECEPTIONIST = "RECEPTIONIST";
    public static final String CUSTOMER = "CUSTOMER";
}
