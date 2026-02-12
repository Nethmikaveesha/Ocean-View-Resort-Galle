package com.oceanview.backend.config;

/**
 * Centralized role constants to avoid typos between frontend and backend.
 */
public final class Roles {

    private Roles() {}

    // Spring Security expects ROLE_ prefix for hasRole()
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";

    // Raw role values (used in JWT response, DB storage)
    public static final String ADMIN = "ADMIN";
    public static final String CUSTOMER = "CUSTOMER";

    // Admin sub-roles (all map to ROLE_ADMIN for authorization)
    public static final String MANAGER = "MANAGER";
    public static final String RECEPTIONIST = "RECEPTIONIST";
}
