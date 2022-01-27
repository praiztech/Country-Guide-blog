# Calculator

A basic accessible calculator built with HTML, CSS and vanilla JavaScript.

## Table of Contents

- [Overview](#overview)
  - [Project Aim](#project-aim)
  - [Design](#design)
  - [Live Site](#live-site)
- [Technologies Used](#technologies-used)
- [Useful Resources](#useful-resources)

## Overview

### Project Aim

The aim of this project is to create an accessible calculator app capable of performing basic mathematical operations, i.e., addition, subtraction, multiplication and division. This web application implements the following key accessibility features:
- Keyboard-only navigation and keyboard shortcuts for operating the calculator
- Screen reader use support
- Speech recognition software use support
- Contrast themes use support

### Design

This web application features a light and dark theme design. Its layout was built with a mobile-first responsive design that has been optimized for mobile, tablet, laptop and desktop devices.

### Live Site

[View the Live Site](https://praiztech.github.io/calculator-app)

## Technologies Used

- Semantic HTML5 markup
- WAI-ARIA roles and properties
- CSS including flexbox, grid and custom properties
- Custom Webfonts
- Modern JavaScript (ES6+) syntax

## Useful Resources

- The [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www/w3.org/TR/wai-aria-1.1) and [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1) provide guidelines and design patterns for building accessible user-interface (UI) components across the web. They served as a blueprint for the development of this application.

- Although the [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1) provides several widely-supported UI templates, it is sometimes the case that these design templates are only marginally supported by assistive technologies. One of such cases is the modal dialog design pattern. On implementing the recommended WAI-ARIA design for a modal dialog and testing with screen readers, I discovered that only a minority announced the widget as expected. This article on [the current state of modal dialog accessibility](https://www.tpgi.com/the-current-state-of-modal-dialog-accessibility) was instrumental to building a modal dialog that had much wider screen reader support.
