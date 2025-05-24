# BP-Frontend

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

BP-Frontend is an Angular-based frontend application built with Nx workspace. It provides a modern, responsive user interface for managing and displaying data with features like filtering, sorting, and real-time updates.

## Features

- **Modern UI Components**: Built with Angular Material and custom components
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Data Management**: Efficient handling of data with filtering and sorting capabilities
- **Unit Testing**: Comprehensive test coverage with Jest
- **Type Safety**: Built with TypeScript for enhanced development experience

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI
- Backend API server running

## Important Note: CORS Configuration

Before running the application, ensure that the backend server has CORS (Cross-Origin Resource Sharing) properly configured. Without this configuration, you will encounter CORS errors when making API requests.

To enable CORS in your backend:
1. Install the CORS package: `npm install cors`
2. Configure CORS in your backend application to allow requests from the frontend origin

## Getting Started

1. Clone the repository
2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npx nx serve bp-frontend
```

The application will be available at `http://localhost:4200`

## Available Commands

### Development
```sh
# Start development server
npx nx serve bp-frontend

# Run tests
npx nx test bp-frontend

# Run tests with coverage
npx nx test bp-frontend --coverage
```

### Production
```sh
# Create production build
npx nx build bp-frontend

# Preview production build
npx nx serve bp-frontend --prod
```

## Project Structure

- `apps/bp-frontend/`: Main application code
- `libs/shared/ui/`: Shared UI components
- `libs/shared/models/`: Shared model structures

## Testing

The project includes comprehensive unit tests. To run tests:

```sh
# Run all tests
npx nx test bp-frontend

# Run tests with coverage
npx nx test bp-frontend --coverage
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request

## Additional Resources

- [Angular Documentation](https://angular.dev/overview)
- [Nx Documentation](https://nx.dev)

## License

This project is licensed under the MIT License.
