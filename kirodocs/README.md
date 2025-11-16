# Frankenstein Story Generator - Documentation

## Overview

This directory contains comprehensive documentation for the Frankenstein AI-powered children's story generator. The project creates immersive, multimedia stories with AI-generated text, images, narration, and sound effects.

## Documentation Structure

### 📁 APIs
Documentation for third-party API integrations:
- [API Integrations](apis/API_INTEGRATIONS.md) - Overview of all external APIs
- [Free APIs Added](apis/FREE_APIS_ADDED.md) - Free API services integrated
- [APIs README](apis/README.md) - API documentation index

### 🏗️ Architecture
System architecture and design documentation:
- [Component Architecture](architecture/COMPONENT_ARCHITECTURE.md) - Frontend component structure

### 💻 Development
Development processes and guidelines:
- [Build Process](development/BUILD_PROCESS.md) - How to build and run the project
- [Refactoring Summary](development/REFACTORING_SUMMARY.md) - Code refactoring history
- [Responsive Sizing](development/RESPONSIVE_SIZING_CHANGES.md) - UI responsiveness improvements
- [Development README](development/README.md) - Development documentation index

### 🚀 Implementation
Feature implementation summaries:
- [Implementation Summary](implementation/IMPLEMENTATION_SUMMARY.md) - Overall implementation details
- [Final Implementation](implementation/FINAL_IMPLEMENTATION_SUMMARY.md) - Final feature set
- [Story Customization](implementation/STORY_CUSTOMIZATION_SUMMARY.md) - Customization features
- [Spooky Elements](implementation/SPOOKY_ELEMENTS_SUMMARY.md) - Themed UI components
- [Implementation README](implementation/README.md) - Implementation documentation index

### 🧪 Testing
Testing documentation and guides:
- [Integration Test Plan](testing/INTEGRATION_TEST_PLAN.md) - Testing strategy
- [Integration Test Summary](testing/INTEGRATION_TEST_SUMMARY.md) - Test results
- [Validation Checklist](testing/INTEGRATION_VALIDATION_CHECKLIST.md) - QA checklist
- [Testing README](testing/README.md) - Testing documentation index

### ✨ Features
New feature documentation:
- [Form Improvements](features/FORM_IMPROVEMENTS.md) - Enhanced input form UX
- [Moral Themes](features/MORAL_THEMES.md) - Educational story themes

### 🐛 Bug Fixes
Bug fix documentation:
- [Voice Selector Validation](bugfixes/VOICE_SELECTOR_VALIDATION.md) - Form validation fix
- [API Migration](bugfixes/API_MIGRATION_ZENQUOTES.md) - ZenQuotes API migration

### ⚡ Performance
Performance optimization documentation:
- [GPU Optimization](performance/GPU_OPTIMIZATION.md) - Chrome performance fixes

## Quick Links

### For Developers
- [Build Process](development/BUILD_PROCESS.md) - Get started with development
- [Component Architecture](architecture/COMPONENT_ARCHITECTURE.md) - Understand the codebase
- [API Integrations](apis/API_INTEGRATIONS.md) - External service setup

### For Contributors
- [Recent Updates](RECENT_UPDATES.md) - Latest changes and improvements
- [Testing Guide](testing/README.md) - How to test your changes
- [Refactoring Summary](development/REFACTORING_SUMMARY.md) - Code quality improvements

### For Project Managers
- [Implementation Summary](implementation/IMPLEMENTATION_SUMMARY.md) - Feature overview
- [Integration Test Summary](testing/INTEGRATION_TEST_SUMMARY.md) - Quality assurance
- [Story Customization](implementation/STORY_CUSTOMIZATION_SUMMARY.md) - User-facing features

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0 with Java 21
- **AI Services**: Anthropic Claude, Stability AI, ElevenLabs
- **Build Tool**: Maven 3.8+

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion, GSAP, Three.js

### External APIs
- **Story Generation**: Anthropic Claude (Sonnet 4.5)
- **Image Generation**: Stability AI (SDXL 1024)
- **Audio Generation**: ElevenLabs
- **Quotes**: ZenQuotes API
- **Jokes**: JokeAPI
- **Time of Day**: Sunrise-Sunset API

## Recent Major Updates

### November 16, 2025
- ✅ Moral themes feature for educational storytelling
- ✅ Non-linear form navigation with smart randomization
- ✅ GPU performance optimizations for Chrome stability
- ✅ Voice selector validation bug fix
- ✅ Admin page configuration display fix
- ✅ 3D book image alignment improvements
- ✅ Progress bar status display enhancements

See [RECENT_UPDATES.md](RECENT_UPDATES.md) for detailed changelog.

## Contributing

When adding new features or fixing bugs:
1. Update relevant documentation in this directory
2. Add entry to [RECENT_UPDATES.md](RECENT_UPDATES.md)
3. Create feature/bugfix documentation if significant
4. Update API documentation if external services change
5. Add test documentation for new test coverage

## Documentation Standards

- Use Markdown format for all documentation
- Include code examples where relevant
- Add "Date" section at end of each document
- Keep documentation up-to-date with code changes
- Use clear headings and structure
- Include "Before/After" comparisons for changes

## Contact

For questions about documentation:
- Check existing docs first
- Review recent updates
- Consult architecture documentation
- Check API integration guides

---

**Last Updated**: November 16, 2025
