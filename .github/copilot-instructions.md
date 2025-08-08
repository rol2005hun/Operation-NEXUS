# NEXUS - Digital Investigation Agency Game

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Nuxt 4 TypeScript project for creating an FBI-style investigation game called "NEXUS - Digital Investigation Agency". The game simulates a laptop environment where players can investigate different cases by exploring emails, messages, files, and other digital evidence.

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript
- **Styling**: SCSS with custom variables
- **State Management**: Pinia
- **Fonts**: Inter (UI) and JetBrains Mono (code/terminal)

## Project Structure

- `stores/` - Pinia stores for game state and laptop simulation
- `components/` - Vue components for laptop apps and UI elements
- `pages/` - Main game pages
- `assets/scss/` - Global styles and variables

## Key Features

1. **Mission Selection**: Main menu with different investigation cases
2. **Laptop Simulation**: Full desktop environment with apps, taskbar, and windows
3. **Email Investigation**: Email client with suspicious communications
4. **Message Analysis**: Chat application with evidence
5. **File Exploration**: Document and evidence management
6. **Window Management**: Draggable, resizable windows like a real OS

## Current Missions

### Available Missions:
- **the-internal-leak**: Corporate espionage investigation at defense contractor (Nexus-Corp Industries)
- **banking-fraud-investigation**: Sophisticated fraud scheme at City National Bank involving cryptocurrency laundering

### Mission Development:
- **Mission Documentation**: Complete mission creation guide available in `missions/README.md`
- **Mission Structure**: Each mission has its own folder with complete file set: characters.ts, emails.ts, chats.ts, files.ts, evidence.ts, metadata.ts, settings.ts, objectives.ts, timeline.ts, records.ts, apps.ts, and index.ts
- **Evidence System**: Centralized evidence definitions following SOLID principles
- **Mission Registry**: All missions must be registered in `utils/registerMission.ts` for dynamic loading
- **Mission IDs**: Must match between game store, mission registry, and mission content files

## Application Names

### Current Laptop Applications:
- **SecureMail**: Standard email client (renamed from Email)
- **CipherChat**: Encrypted messaging application (formerly Chat)
- **File Explorer**: Document and file management
- **Browser**: Nexium web browser
- **JobDescription**: Investigation briefing and case details (formerly Notes)
- **EvidenceLocker**: Evidence collection and analysis with deletion functionality (formerly Evidence)
- **CryptoCracker**: Cipher decryption tool for encrypted evidence
- **Settings**: System configuration and preferences

## Component Guidelines

- Use SCSS variables from `variables.scss` 
- Follow the established color scheme (dark theme with blue accents: #007acc)
- Maintain realistic laptop/desktop UI patterns
- Include proper TypeScript interfaces
- Use Pinia stores for state management
- Implement proper window management (draggable, resizable, maximize/minimize)
- Follow modern Vue 3 Composition API patterns

## Styling Guidelines

- Dark theme with professional investigation agency aesthetics
- Primary color: #007acc (accent blue)
- Use CSS Grid and Flexbox for layouts
- Include hover effects and smooth transitions
- Mobile responsive design
- Consistent spacing and typography
- Use modern SCSS features (@use, @forward)
- Proper list styling with adequate padding and indentation

## Development Guidelines

- Use TypeScript for all components and stores
- Implement proper error handling
- Follow Vue 3 best practices
- Use semantic HTML elements
- Ensure accessibility compliance
- Write clean, maintainable code
- Focus on self-documenting code with clear variable and function names
- DO NOT USE ANY COMMENTS

## TypeScript Interface Guidelines

### Evidence System (2025 Update):
- **SOLID Principles**: Evidence system refactored
- **Centralized Evidence**: All evidence items defined in mission's `evidence.ts` file
- **Clean Interfaces**: Removed evidence-related optional properties from Email, Chat, and FileDocument interfaces
- **Dynamic Evidence**: Only CryptoCracker can add evidence dynamically during gameplay

### General Interface Rules:
- Every interface should have explicit `id: string;` field
- Use optional (`?`) fields sparingly - prefer explicit required fields with default values in code
- Common default value patterns:
  - `boolean` fields: default `false` (e.g., `encrypted: boolean` defaults to `false`)
  - `number` fields: default `0` (e.g., `unreadCount: number` defaults to `0`)
  - `string` fields: default empty string (e.g., `lastMessage: string` defaults to `''`)
  - `Date` fields: default `new Date()` for timestamps
  - Array fields: default empty array `[]`
- Handle default values in components/functions, not in interfaces
- Example: `chat.unreadCount || 0` and `chat.lastMessageTime || new Date()`

## Testing Guidelines

- **Browser Testing**: User handles all browser testing and preview responsibilities
- **Development Server**: Use VS Code tasks to run development server
- **Tool Usage**: Do not use `open_simple_browser` tool - user manages browser interactions
- **Feedback Loop**: User will provide testing feedback and report any issues found during browser testing

## Code Style Guidelines

- **Semicolons**: Always use semicolons (`;`) at the end of statements, except after closing braces (`}`)
- **Import Paths**: Use `@/` alias instead of `~/` (Nuxt 4 default) for import paths (e.g., `@/stores/game`, `@/components/...`)
- **Examples**:
  - ✅ `const x = 5;`
  - ✅ `import { ref } from 'vue';`
  - ✅ `import { useGameStore } from '@/stores/game';`
  - ✅ `import LaptopScreen from '@/components/LaptopScreen.vue';`
  - ✅ `if (condition) { doSomething(); }`
  - ❌ `const x = 5` (missing semicolon)
  - ❌ `import { useGameStore } from '~/stores/game';` (wrong alias)
  - ❌ `}; // after closing brace` (unnecessary semicolon)

## Evidence System Architecture (2025)

### SOLID Principles Implementation:
- **Single Responsibility**: Each mission's evidence defined in dedicated `evidence.ts` file
- **Open/Closed**: Evidence system extensible without modifying existing interfaces
- **Dependency Inversion**: Components depend on centralized evidence definitions, not scattered properties

### Evidence Workflow:
1. **Define Evidence**: Create `evidence.ts` with array of evidence item IDs
2. **Reference Evidence**: Import and include `evidenceItems` in mission's `index.ts`
3. **Check Evidence**: Use game store's `isRealEvidence(id)` method
4. **Dynamic Evidence**: CryptoCracker can add evidence via `toggleEvidence()` method

### Migration Notes:
- **Added**: Centralized `evidenceItems: string[]` in MissionContent
- **Updated**: All existing missions to use new evidence system

## Programming Principles & Design Guidelines

### Clean Code Principles
- **Meaningful Names**: Use descriptive, intention-revealing names for variables, functions, and classes
- **Functions**: Keep functions small, focused on single responsibility, and avoid side effects
- **Formatting**: Maintain consistent horizontal and vertical formatting (newspaper metaphor)
- **Error Handling**: Use proper exception handling, avoid null returns and null parameters

### Object-Oriented Design Principles
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through abstraction and reusable components
- **KISS (Keep It Simple, Stupid)**: Prefer simple, straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't implement features until they are actually needed
- **Loose Coupling**: Minimize dependencies between components and modules
- **High Cohesion**: Group related functionality together in well-defined modules

### SOLID Principles
- **Single Responsibility Principle (SRP)**: Each class/component should have only one reason to change
- **Open/Closed Principle (OCP)**: Software entities should be open for extension, closed for modification
- **Liskov Substitution Principle (LSP)**: Objects should be replaceable with instances of their subtypes
- **Interface Segregation Principle (ISP)**: Many client-specific interfaces are better than one general-purpose interface
- **Dependency Inversion Principle (DIP)**: Depend on abstractions, not concretions

### Design Patterns & Architecture
- **MVC Pattern**: Separate concerns with Model-View-Controller architecture (Nuxt follows this pattern)
- **Observer Pattern**: Use reactive programming patterns (Vue's reactivity system)
- **Factory Pattern**: Use factory functions for object creation when appropriate
- **Decorator Pattern**: Enhance functionality without modifying original classes
- **Composition over Inheritance**: Prefer component composition over class inheritance

### Code Quality & Anti-patterns
- **Avoid God Objects**: Prevent classes that know/do too much
- **Avoid Spaghetti Code**: Maintain clear structure and logical flow
- **Avoid Magic Numbers**: Use named constants instead of hardcoded values
- **Avoid Long Parameter Lists**: Use configuration objects or builder patterns
- **Avoid Deep Nesting**: Use early returns and guard clauses to reduce complexity

### TypeScript Best Practices
- **Strong Typing**: Use explicit types, avoid `any` type
- **Interface Segregation**: Create specific interfaces for different use cases
- **Type Guards**: Use type guards for runtime type checking
- **Generic Types**: Use generics for reusable type-safe components
- **Null Safety**: Handle undefined/null cases explicitly