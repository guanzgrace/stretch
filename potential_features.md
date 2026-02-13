# Potential Features

> **Note:** This extension is no longer actively maintained. These ideas are documented for reference or for anyone who might fork the project.

Roughly ordered by impact vs. effort:

## High Impact, Low Effort

### Avoid Repeat Exercises
**Problem:** With only 7-8 exercises per category, users see repeats frequently.

**Solution:** Track recently shown exercises in storage and cycle through all of them before repeating.

**Implementation:** Simple addition to the exercise selection logic—immediately noticeable improvement.

### Snooze Button
**Problem:** Users only have two options when a notification appears: do the stretch or close the window.

**Solution:** Add a "Remind me in 5 minutes" button on the notification page.

**Implementation:** Create a one-shot alarm—just a few lines of code.

## Medium Impact, Low Effort

### Streak Counter / Stats
**What:** Track completed stretches (clicked "done" or kept window open for duration) and display count in the popup.

**Why:** Adds motivation without being heavy-handed.

**Implementation:** Could start as simple as a daily counter on the popup, stored in chrome.storage.

### Time Until Next Stretch
**What:** Display a live countdown in the popup showing time remaining until the next scheduled stretch reminder.

**Why:** Helps users know when to expect the next reminder and adds transparency to the timing system.

**Implementation:** Read the next alarm time from `chrome.alarms.get()`, calculate difference from current time, and update display every second while popup is open.

### Extension Icon Badge
**What:** Show the number of stretches completed today (or a small clock icon) on the toolbar badge.

**Why:** Gives the extension more presence and provides at-a-glance feedback.

**Implementation:** Use `chrome.action.setBadgeText()`. Zero UI work required.

### Keyboard Shortcut
**What:** Register a Chrome command to trigger "Get an exercise now" without opening the popup.

**Implementation:** One manifest entry + a listener in background.js.

## Polish

### Dark Mode for Notification Page
**What:** Use `prefers-color-scheme: dark` media query to restyle the notification window.

**Why:** The popup is small enough that dark mode doesn't matter much, but the notification page is a full window with a bright white/orange gradient that can be jarring in dark environments.

**Implementation:** CSS media query with alternative color scheme.
