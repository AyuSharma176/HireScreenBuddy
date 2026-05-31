package com.ayush.hirescreenbuddy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * User Entity - Represents a recruiter user in the system.
 * Stores authentication and profile information.
 */
@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique email address for login and communication */
    @Column(unique = true, nullable = false)
    private String email;

    /** Encrypted password for authentication */
    @Column(nullable = false)
    private String password;

    /** Full name of the recruiter */
    private String name;

    /** User role - currently all users are RECRUITER */
    private String role = "RECRUITER";

    /** Account creation timestamp */
    private LocalDateTime createdAt = LocalDateTime.now();
}