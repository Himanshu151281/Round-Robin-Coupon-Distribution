
# Round-Robin Coupon Distribution with Admin Panel

## Default Credentials
- **Username:** admin
- **Password:** admin123

## Objective
Developed a live web application that distributes coupons to guest users in a round-robin manner while providing an admin panel to manage coupons and prevent abuse.

## Achievements

### 1. Coupon Distribution (User Side)
- Created a system to maintain a list of coupons in a database.
- Implemented sequential assignment of coupons to users without repetition.

### 2. Guest User Access
- Enabled users to claim coupons without logging in.

### 3. Abuse Prevention
- **IP Tracking:** Implemented prevention of multiple claims from the same IP within a cooldown period.
- **Cookie-Based Tracking:** Restricted claims from the same browser session.

### 4. User Feedback
- Displayed messages for successful claims or time restrictions.

### 5. Admin Panel (Server-Side Management)
- **Login for Admin:** Secured access to admin functionality.
- **View Coupons:** Provided a list of all available and claimed coupons.
- **Add/Update Coupons:** Enabled admin to upload new coupons or modify existing ones.
- **User Claim History:** Displayed which users (IP/browser session) claimed coupons.
- **Toggle Coupon Availability:** Allowed dynamic enabling/disabling of certain coupons.

### 6. Live Deployment
- Hosted the application with a publicly accessible link on netlify - https://rrcd-by-himanshu-kumar.netlify.app

### 7. Documentation
- Provided setup instructions and a brief explanation of the implementation.

## Evaluation Criteria
- **Functionality:** Achieved coupon distribution with admin controls.
- **Security:** Ensured robust abuse prevention.
- **User Experience:** Delivered a smooth user & admin UI.
- **Code Quality:** Maintained a maintainable and scalable codebase.
- **Deployment:** Provided a working live URL with credentials for testing.
