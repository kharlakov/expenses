Lucky Pharma Design System
This document outlines the design system, visual style, and technical approach for the Lucky Pharma web application. It serves as a reference for creating new interfaces and ensuring consistency across the project.

1. Approach & Architecture
Design Philosophy
Mobile-First: The design is optimized for mobile devices primarily, with a responsive container that centers and boxes content on desktop screens.
Clean & Soft: Uses a soft color palette with green accents, rounded corners, and diffused shadows to create a friendly, modern, and trustworthy medical aesthetic.
Vanilla CSS: The project uses pure CSS with CSS Variables (Custom Properties) for theming. No preprocessors or frameworks (like Tailwind or Bootstrap) are currently required, keeping the dependency chain light.
Layout Structure
Container: A central wrapper (.container) limits width to 480px (mobile focus) and centers itself on larger screens.
Screens: Sections of the app (.screen) are toggled via JavaScript. Only one screen is active at a time (.active).
Header/Footer: Fixed or sticky elements that frame the main content.
2. Design Tokens
The following CSS variables define the core visual language.

Colors
Token	Value	Description
--color-primary	#2E7D32	Brand Green. Main action color.
--color-primary-hover	#256628	Darker green for hover states.
--color-secondary	#E8F5E9	Light Green. Backgrounds for secondary actions.
--color-bg	#FAFAFA	Global page background (soft grey/white).
--color-bg-white	#FFFFFF	Container and card background.
--color-text	#1F2937	Primary text (Near Black).
--color-text-secondary	#6B7280	Secondary text (Medium Grey).
--color-border	#E5E7EB	Subtle borders.
--color-error	#D32F2F	Error states.
--color-success	#2E7D32	Success messages (Same as primary).
Typography
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Base Size: 16px
Element	Size	Weight	Line Height
.title	1.75rem	800	1.2
.form-title	1.5rem	700	-
.modal-title	1.25rem	700	-
Body Text	1rem	Normal	1.5
Labels	0.9rem	600	-
Small / Hint	0.85rem	Normal	-
Spacing & Shape
Border Radius:
Small: 8px (--radius-sm)
Medium: 12px (--radius-md)
Large: 24px (--radius-lg)
Shadows:
Small: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Medium: 0 4px 6px -1px rgba(...) (Elevated elements)
Large: 0 10px 15px -3px rgba(...) (Modals/Desktop Container)
3. Component Library
Buttons (.btn)
Standard buttons share a common structure:

Height: 56px
Padding: 16px 24px
Radius: 12px
Font weight: 600
Transition: 0.2s ease
Variants:

Primary (.btn-primary): Green background, white text. Used for main actions (Submit, OK).
Secondary (.btn-secondary): Light green background, dark green text. Used for navigation choices.
Back Button (.btn-back): Text with arrow icon, no background. Used for navigation.
Forms (.form)
Inputs (.form-input):
Padding: 16px
Radius: 12px
Background: #FAFAFA (Light Grey)
Border: Transparent default, #2E7D32 on focus (with ring).
Labels: Placed above inputs, bold properties.
Validation: Error messages appear below inputs (.form-error) and inputs get .error class (red border/bg).
Modals (.modal)
Fixed full-screen overlay with blur.
Centered content card with scaleIn animation.
Close button in top-right corner.
4. Technical Implementation Notes / Snippets
CSS Variables Setup
:root {
    --color-primary: #2E7D32;
    --color-bg: #FAFAFA;
    --radius-md: 12px;
    /* ... see full list above */
}
Typical Screen Structure
<section id="screen-name" class="screen">
    <h2 class="title">Screen Title</h2>
    <div class="content">
        <!-- Content here -->
    </div>
</section>
Form Group Pattern
<div class="form-group">
    <label for="field-id" class="form-label">Label <span class="required">*</span></label>
    <input type="text" id="field-id" class="form-input" required>
    <span class="form-error"></span>
</div>

Comment
Ctrl+Alt+M
