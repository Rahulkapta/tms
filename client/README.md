# ProjectFlow - React Native App

A React Native application with phone number authentication and project management features.

## Features

- **Phone Number Login**: Enter your phone number to receive an OTP
- **OTP Verification**: 6-digit OTP verification with auto-focus functionality
- **Projects Dashboard**: View and manage your projects
- **New Project Creation**: Create new projects with detailed information
- **Project Tasks**: View and manage tasks within each project
- **Bottom Navigation**: Navigate between different sections
- **Modern UI**: Clean and responsive design matching the provided HTML templates
- **Reusable Components**: Modular component architecture for maintainability

## Screens

### 1. Login Screen (`/login`)
- Phone number input field
- Send OTP button (enabled only when phone number is entered)
- Terms of service notice

### 2. OTP Verification Screen (`/otp`)
- 6-digit OTP input with auto-focus
- Back navigation
- Verify button (enabled only when OTP is complete)

### 3. Projects Dashboard (`/`)
- Project list with images and task counts
- Filter tabs (All, Completed, Archived)
- Add project button (+)
- Bottom navigation
- Click on project to view tasks

### 4. New Project Screen (`/new-project`)
- Project title input
- Description textarea
- Start and end date inputs
- Manager and employees selection
- Create project button
- Close button to go back

### 5. Project Tasks Screen (`/project-tasks`)
- Task list with status filtering (To Do, In Progress, Completed)
- Task cards showing title and assignee
- Floating add task button (+)
- Back arrow navigation
- Task status indicators

### 6. New Task Screen (`/new-task`)
- Task title input
- Description textarea
- Start and end date inputs
- Assignee selection
- Priority selection
- Create task button
- Close button to go back

### 7. Task Detail Screen (`/task-detail`)
- Editable task title and description
- Start and end date inputs
- Assignee information with avatar
- Priority display
- Comments section with user avatars
- Add comment functionality
- Back navigation

### 8. Add People Screen (`/add-people`)
- Name input field
- Mobile number input field
- Assigned projects dropdown
- Role dropdown
- Add button (enabled when all fields are filled)
- Close button to go back

### 9. Other Screens
- **People** (`/people`): Team management (placeholder)
- **Inbox** (`/inbox`): Messages and notifications (placeholder)
- **Settings** (`/settings`): App settings (placeholder)

## Components

- `Button`: Reusable button component with primary/secondary variants
- `Input`: Reusable input component with error state support
- `TextArea`: Reusable textarea component for multiline input
- `OTPInput`: Specialized component for OTP input with auto-focus
- `Header`: Reusable header component with optional back button
- `BottomNavigation`: Common bottom navigation bar
- `ProjectCard`: Project item display component
- `TaskCard`: Task item display component
- `TabNavigation`: Filter tabs component (customizable)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Project Structure

```
├── app/
│   ├── index.tsx          # Projects dashboard (main screen)
│   ├── login.tsx          # Phone login screen
│   ├── otp.tsx           # OTP verification screen
│   ├── new-project.tsx   # New project creation screen
│   ├── project-tasks.tsx # Project tasks screen
│   ├── new-task.tsx      # New task creation screen
│   ├── task-detail.tsx   # Task detail screen
│   ├── add-people.tsx    # Add people screen
│   ├── people.tsx        # People screen (placeholder)
│   ├── inbox.tsx         # Inbox screen (placeholder)
│   ├── settings.tsx      # Settings screen (placeholder)
│   ├── _layout.tsx       # Root layout configuration
│   └── +not-found.tsx    # 404 page
├── components/
│   ├── Button.tsx        # Reusable button component
│   ├── Input.tsx         # Reusable input component
│   ├── TextArea.tsx      # Reusable textarea component
│   ├── OTPInput.tsx      # OTP input component
│   ├── Header.tsx        # Header component
│   ├── BottomNavigation.tsx # Bottom navigation component
│   ├── ProjectCard.tsx   # Project card component
│   ├── TaskCard.tsx      # Task card component
│   └── TabNavigation.tsx # Tab navigation component
└── ...
```

## Navigation Flow

1. **Login** (`/login`) → Enter phone number
2. **OTP Verification** (`/otp`) → Enter 6-digit code
3. **Projects Dashboard** (`/`) → Main app with bottom navigation
4. **Project Tasks** (`/project-tasks`) → View project tasks (accessed via project card)
5. **Task Detail** (`/task-detail`) → View and edit task details (accessed via task card)
6. **New Project** (`/new-project`) → Create new project (accessed via + button)
7. **New Task** (`/new-task`) → Create new task (accessed via + button in project tasks)
8. **Add People** (`/add-people`) → Add new team member
9. **Other tabs** → Navigate between different sections

## Technologies Used

- React Native
- Expo Router
- TypeScript
- React Navigation

## Next Steps

To complete the application, you would need to:

1. Integrate with a backend API for OTP generation and verification
2. Add proper error handling and loading states
3. Implement secure storage for authentication tokens
4. Add proper form validation
5. Implement date pickers for start/end dates
6. Add dropdown/select components for manager and employees
7. Create add task screen and functionality
8. Implement task status updates and drag-and-drop
9. Implement the remaining screens (People, Inbox, Settings)
10. Add project creation and management functionality
11. Implement real-time updates and notifications 