---
version: alpha
name: "BI Official Web"
description: "Bank Indonesia's official web portal uses a deep institutional blue palette anchored by #045498 and #007bff, with PT Sans as the sole typeface across all hierarchy levels. The layout follows a structured government portal pattern: a utility nav bar in dark navy, a primary nav with blue underline indicators, a full-bleed hero carousel featuring monetary policy announcements, and a row of stat cards displaying key economic indicators. The design prioritises information authority and data clarity over marketing aesthetics, with minimal decoration, flat surfaces, and a single subtle drop shadow."
colors:
  crimson-accent: "#b11116"
  white: "#ffffff"
  bootstrap-blue: "#007bff"
  dark-text: "#212529"
  medium-gray: "#333333"
  muted-gray: "#909090"
  navy-primary: "#045498"
  subtle-gray: "#58595b"
  light-border: "#e7e7e7"
typography:
  body-default:
    fontFamily: "PT Sans"
    fontSize: "17.3333px"
    fontWeight: "400"
    lineHeight: "26px"
  body-small:
    fontFamily: "PT Sans"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "21px"
  body-medium:
    fontFamily: "PT Sans"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-semibold:
    fontFamily: "PT Sans"
    fontSize: "17.3333px"
    fontWeight: "600"
    lineHeight: "26px"
  heading-large:
    fontFamily: "PT Sans"
    fontSize: "26px"
    fontWeight: "600"
    lineHeight: "31.2px"
  heading-xl:
    fontFamily: "PT Sans"
    fontSize: "26px"
    fontWeight: "700"
    lineHeight: "31.2px"
  subheading-medium:
    fontFamily: "PT Sans"
    fontSize: "24px"
    fontWeight: "500"
    lineHeight: "28.8px"
  nav-item:
    fontFamily: "PT Sans"
    fontSize: "17px"
    fontWeight: "500"
    lineHeight: "20.4px"
  micro:
    fontFamily: "PT Sans"
    fontSize: "10px"
    fontWeight: "400"
    lineHeight: "15px"
  search-placeholder:
    fontFamily: "Segoe UI"
    fontSize: "13px"
    fontWeight: "400"
    lineHeight: "19.5px"
rounded:
  card: "8px"
  badge: "5px"
  none: "0px"
spacing:
  xs: "3px"
  sm-1: "4px"
  sm-2: "5px"
  sm-3: "6px"
  sm: "8px"
  sm-4: "8.7px"
  md-1: "10px"
  md-2: "14px"
  md: "15px"
  md-3: "16px"
  md-4: "17px"
  md-5: "17.3px"
  lg-1: "20px"
  lg-2: "22px"
  lg: "26px"
  lg-3: "30px"
components:
  badge-live-badge:
    textColor: "{colors.white}"
    backgroundColor: "{colors.crimson-accent}"
    rounded: "{rounded.badge}"
    fontSize: "14px"
    fontWeight: "600"
  banner-ticker-default:
    textColor: "{colors.dark-text}"
    backgroundColor: "{colors.white}"
    fontSize: "17.3333px"
    fontWeight: "400"
  content-body-default:
    textColor: "{colors.dark-text}"
    backgroundColor: "transparent"
    fontSize: "17.3333px"
    fontWeight: "400"
    lineHeight: "{spacing.lg}"
  data-card-stat-card-default:
    textColor: "{colors.white}"
    backgroundColor: "{colors.navy-primary}"
    rounded: "{rounded.card}"
    fontSize: "17.3333px"
    padding: "0px"
  form-search-default:
    textColor: "#777777"
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
    padding: "6px 10px"
    fontSize: "15.6px"
  hero-carousel-control:
    textColor: "{colors.white}"
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
  hero-hero-banner:
    textColor: "{colors.white}"
    backgroundColor: "transparent"
    fontSize: "26px"
    fontWeight: "600"
    rounded: "{rounded.none}"
    padding: "0px"
  link-link-default:
    textColor: "{colors.bootstrap-blue}"
    backgroundColor: "transparent"
    fontSize: "17.3333px"
    rounded: "{rounded.none}"
  navigation-nav-item-active:
    textColor: "{colors.navy-primary}"
    borderBottom: "4px solid #045498"
    fontWeight: "600"
  navigation-nav-item-default:
    textColor: "{colors.navy-primary}"
    backgroundColor: "transparent"
    borderBottom: "4px solid #045498"
    padding: "0px 0px 16px"
    fontSize: "17.3333px"
    fontWeight: "400"
    rounded: "{rounded.none}"
  navigation-utility-nav:
    textColor: "{colors.white}"
    backgroundColor: "{colors.dark-text}"
    fontSize: "17.3333px"
    fontWeight: "400"
  pagination-dot-active:
    backgroundColor: "{colors.crimson-accent}"
    rounded: "{rounded.badge}"
  pagination-dot-inactive:
    backgroundColor: "{colors.muted-gray}"
    rounded: "50%"
---

## Overview

Bank Indonesia's official web portal uses a deep institutional blue palette anchored by #045498 and #007bff, with PT Sans as the sole typeface across all hierarchy levels. The layout follows a structured government portal pattern: a utility nav bar in dark navy, a primary nav with blue underline indicators, a full-bleed hero carousel featuring monetary policy announcements, and a row of stat cards displaying key economic indicators. The design prioritises information authority and data clarity over marketing aesthetics, with minimal decoration, flat surfaces, and a single subtle drop shadow.

**Signature traits:**
- Dual typeface system: Pairs PT Sans and Segoe UI across the type hierarchy.
- Layered elevation: Depth comes from 1 validated shadow token.

## Colors

The palette uses 9 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **surface-text** maps to `navy-primary`: Role "text" is grounded by usage context "Primary navigation text, nav dropdown underline indicator, stat card backgrounds, brand color".
- **action-text** maps to `bootstrap-blue`: Role "text" is grounded by usage context "Link color, interactive elements, hover states".
- **content-text** maps to `dark-text`: Role "text" is grounded by usage context "Body text, footer text, general content".
- **surface-background** maps to `white`: Role "background" is grounded by usage context "Page background, hero overlay text, card text on dark surfaces".

### Text Scale
- **Bootstrap Blue** (#007bff): Link color, interactive elements, hover states. Role: text. {authored: rgb(0, 123, 255), space: rgb}
- **Dark Text** (#212529): Body text, footer text, general content. Role: text. {authored: rgb(33, 37, 41), space: rgb}
- **Medium Gray** (#333333): Secondary body text, footer links. Role: text. {authored: rgb(51, 51, 51), space: rgb}
- **Muted Gray** (#909090): Tertiary text, disabled states, captions. Role: text. {authored: rgb(144, 144, 144), space: rgb}
- **Navy Primary** (#045498): Primary navigation text, nav dropdown underline indicator, stat card backgrounds, brand color. Role: text. {authored: rgb(4, 84, 152), space: rgb}
- **Subtle Gray** (#58595b): Muted body text, secondary content areas. Role: text. {authored: rgb(88, 89, 91), space: rgb}

### Interactive
- **Light Border** (#e7e7e7): Dividers, section borders, hairlines. Role: border. {authored: rgb(231, 231, 231) rgb(33, 37, 41) rgb(33, 37, 41), space: rgb}

### Surface & Shadows
- **Crimson Accent** (#b11116): LIVE badge, alert indicators, red accent elements. Role: background. {authored: rgb(177, 17, 22), space: rgb}
- **White** (#ffffff): Page background, hero overlay text, card text on dark surfaces. Role: background. {authored: rgb(255, 255, 255), space: rgb, alpha: 0.85}

## Typography

Typography uses PT Sans, Segoe UI across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes PT Sans and Segoe UI for visual contrast. Weight range spans regular, semi-bold, bold, medium. Sizes range from 10px to 26px.

### Font Roles
- **Headline Font**: PT Sans
- **Body Font**: PT Sans

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Primary body text, navigation items, general content | PT Sans | 17.3333px | 400 | 26px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Small labels, captions, footnotes | PT Sans | 14px | 400 | 21px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Secondary body text, card descriptions | PT Sans | 16px | 400 | 24px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Emphasized body text, nav active states | PT Sans | 17.3333px | 600 | 26px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Section headings, hero titles, stat card labels | PT Sans | 26px | 600 | 31.2px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Hero banner primary headline | PT Sans | 26px | 700 | 31.2px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Sub-section headings, card titles | PT Sans | 24px | 500 | 28.8px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Primary navigation links | PT Sans | 17px | 500 | 20.4px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Micro labels, badges, tags | PT Sans | 10px | 400 | 15px | normal | PT Sans, PT Sans, sans-serif | Extracted token |
| Search input placeholder text | Segoe UI | 13px | 400 | 19.5px | normal | Segoe UI, Segoe, Tahoma, Helvetica, Arial, sans-serif | Extracted token |

## Layout

Responsive system uses 3 breakpoint tier(s): mobile, tablet, desktop.

This system uses a 8px base grid with scale values 3, 4, 5, 6, 8, 10, 14, 15, 16, 17, 20, 22, 26, 30, 32, 40.

### Responsive Strategy
- **mobile (576-1900px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **tablet (640-1023px)**: Increase spacing and column structure for medium-width viewports.
- **desktop (>= 1024px)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| xs | 3px | 3 | Extracted spacing token |
| sm-1 | 4px | 4 | Extracted spacing token |
| sm-2 | 5px | 5 | Extracted spacing token |
| sm-3 | 6px | 6 | Extracted spacing token |
| sm | 8px | 8 | Extracted spacing token |
| sm-4 | 8.7px | 8.7 | Extracted spacing token |
| md-1 | 10px | 10 | Extracted spacing token |
| md-2 | 14px | 14 | Extracted spacing token |
| md | 15px | 15 | Extracted spacing token |
| md-3 | 16px | 16 | Extracted spacing token |
| md-4 | 17px | 17 | Extracted spacing token |
| md-5 | 17.3px | 17.3 | Extracted spacing token |
| lg-1 | 20px | 20 | Extracted spacing token |
| lg-2 | 22px | 22 | Extracted spacing token |
| lg | 26px | 26 | Extracted spacing token |
| lg-3 | 30px | 30 | Extracted spacing token |
| xl | 32px | 32 | Extracted spacing token |
| xl-2 | 40px | 40 | Extracted spacing token |
| 2xl | 147.2px | 147.2 | Extracted spacing token |
| 3xl | 192px | 192 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| card-shadow | 1 | 0px 0px 7px 0px rgba(0, 0, 0, 0.47) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | outline-color | rgb(33, 37, 41) ; rgb(255, 255, 255) ; rgb(0, 123, 255) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px ; -2px |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| none | 0px | 0 | Hairline corner |
| badge | 5px | 5 | Subtle corner |
| card | 8px | 8 | Control corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| card | 8px | px |
| badge | 5px | px |
| none | 0px | px |

## Components

Components should be recreated from token references first, then tuned with variant notes and probe-backed state guidance.
- **Primary Navigation Bar**: Horizontal primary nav with blue text links and a 4px bottom-border underline indicator on active/hover items. Transparent background, no box shadow.
- **Utility Navigation Bar**: Top utility bar in dark navy (#212529 background) with white text links for secondary actions like Karier, Edukasi, Glosarium, Peta Situs.
- **Hero Carousel**: Full-bleed hero banner carousel with photographic/illustrated backgrounds, white overlay text, and left/right arrow controls. Features monetary policy announcement content.
- **Stat Card**: Rectangular cards displaying key economic indicators (BI-Rate, Inflasi IHK, Target Inflasi) with a blue background, white text, and 8px border radius.
- **Search Input**: Inline search box in the utility nav bar with placeholder text and a search icon button. Transparent background, no border radius.
- **LIVE Badge**: Red pill badge with white text and 'LIVE' label used in the announcement ticker bar.
- **Carousel Dot Indicator**: Row of dot indicators below the hero carousel. Active dot is elongated/red (#b11116), inactive dots are gray circles.
- **Announcement Ticker**: Full-width horizontal ticker bar below the hero carousel displaying upcoming RDG dates with LIVE badge and social media channel links.
- **Body Text Block**: Standard body text block used in article summaries and section descriptions below the hero.
- **Hyperlink**: Inline text links using Bootstrap blue, no underline by default.

### Badge

**live-badge**
- textColor: #ffffff
- backgroundColor: #b11116
- rounded: 5px
- fontSize: 14px
- fontWeight: 600

### Banner

**ticker-default**
- textColor: #212529
- backgroundColor: #ffffff
- fontSize: 17.3333px
- fontWeight: 400

### Content

**body-default**
- textColor: #212529
- backgroundColor: transparent
- fontSize: 17.3333px
- fontWeight: 400
- lineHeight: 26px

### Data Card

**stat-card-default**
- textColor: #ffffff
- backgroundColor: #045498
- rounded: 8px
- fontSize: 17.3333px
- padding: 0px
- State guidance: Probe confirms borderRadius: 8px on div.card__small-item

### Form

**search-default**
- textColor: #777777
- backgroundColor: transparent
- rounded: 0px
- padding: 6px 10px
- fontSize: 15.6px
- State guidance: Probe confirms color: rgb(119,119,119) and padding: 6px 10px

### Hero

**carousel-control**
- textColor: #ffffff
- backgroundColor: transparent
- rounded: 0px

**hero-banner**
- textColor: #ffffff
- backgroundColor: transparent
- fontSize: 26px
- fontWeight: 600
- rounded: 0px
- padding: 0px

### Link

**link-default**
- textColor: #007bff
- backgroundColor: transparent
- fontSize: 17.3333px
- rounded: 0px
- State guidance: Probe confirms color: rgb(0,123,255) on anchor elements

### Navigation

**nav-item-active**
- textColor: #045498
- borderBottom: 4px solid #045498
- fontWeight: 600

**nav-item-default**
- textColor: #045498
- backgroundColor: transparent
- borderBottom: 4px solid #045498
- padding: 0px 0px 16px
- fontSize: 17.3333px
- fontWeight: 400
- rounded: 0px

**utility-nav**
- textColor: #ffffff
- backgroundColor: #212529
- fontSize: 17.3333px
- fontWeight: 400

### Pagination

**dot-active**
- backgroundColor: #b11116
- rounded: 5px

**dot-inactive**
- backgroundColor: #909090
- rounded: 50%

## Do's and Don'ts

Guardrails protect Dual typeface system, Layered elevation without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 320px | (max-width: 320px) |
| Mobile | <= 326px | (max-width: 326px) |
| Mobile | <= 360px | (max-width: 360px) |
| Mobile | <= 376px | (max-width: 376px) |
| Mobile | <= 415px | (max-width: 415px) |
| Mobile | <= 450px | (max-width: 450px) |
| Mobile | <= 480px | (max-width: 480px) |
| Mobile | <= 520px | (max-width: 520px) |
| Mobile | <= 542px | (max-width: 542px) |
| Mobile | <= 575.98px | (max-width: 575.98px) |
| Mobile | <= 600px | (max-width: 600px) |
| Mobile | <= 639px | (max-width: 639px) |
| Mobile | <= 640px | screen and (max-width: 640px) |
| Mobile | <= 694px | (max-width: 694px) |
| Mobile | <= 695px | (max-width: 695px) |
| Mobile | <= 747px | (max-width: 747px) |
| Mobile | <= 767px | (max-width: 767px) |
| Breakpoint 18 | <= 767.98px | (max-width: 767.98px) |
| Breakpoint 19 | <= 768px | (max-width: 768px) |
| Breakpoint 20 | <= 988px | (max-width: 988px) |

## Agent Prompt Guide

### Example Component Prompts
- Create Announcement Ticker variant that preserves Full-width horizontal ticker bar below the hero carousel displaying upcoming RDG dates with LIVE badge and social media channel links..
- Create Body Text Block variant that preserves Standard body text block used in article summaries and section descriptions below the hero..
- Create Carousel Dot Indicator variant that preserves Row of dot indicators below the hero carousel. Active dot is elongated/red (#b11116), inactive dots are gray circles..

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
