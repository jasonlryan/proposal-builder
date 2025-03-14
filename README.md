# Proposal Builder

A drag-and-drop system that allows consultants and sales teams to create custom proposals by combining pre-defined service components.

## Features

- Multiple component libraries (AI-B-C Programme, Research Sprint)
- Drag-and-drop interface for proposal creation
- Sub-element configuration with various input types
- Real-time price calculation and update
- Volume discount support
- Comprehensive proposal preview
- Multiple export/sharing options

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+) or yarn (v1.22+)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-organization/proposal-builder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd proposal-builder
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Select a component library from the dropdown menu.
2. Drag components from the library to the proposal frame.
3. Configure each component's sub-elements.
4. View the proposal summary and pricing information.
5. Preview or publish the proposal.

## Project Structure

- `src/components`: React components for the UI
- `src/context`: Context providers for state management
- `src/hooks`: Custom hooks for business logic
- `public/assets`: Static assets including component libraries

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Context API for state management
- Custom hooks for business logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.
