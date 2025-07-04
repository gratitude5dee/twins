**URL**: [https://lovable.dev/projects/ef9ce659-f174-403e-b9b6-ff35eaf32e75](https://twins.lovable.app/)

# AgentForge 🤖

Create, customize, and deploy powerful AI agents with secure secret management and a sleek, modern interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&style=flat-square)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase&style=flat-square)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite&style=flat-square)](https://vitejs.dev/)

**AgentForge** is a full-stack platform for building your own army of specialized AI agents. Whether you need a research assistant, a social media manager, or a customer support bot, AgentForge provides the tools to define your agent's personality, knowledge, and integrations, and then interact with it through a clean, conversational UI.

<br/>

![AgentForge Dashboard Screenshot](https://raw.githubusercontent.com/gpt-engineer-org/twins/main/public/og-image.png)

## ✨ Features

-   **🤖 Custom Agent Creation**: A step-by-step wizard to define your agent's name, personality, icon, and instructions.
-   **🔐 Secure Secret Management**: Safely store API keys and other credentials for your agents, with data protected by Supabase's Row Level Security.
-   **💬 Conversational UI**: A dedicated chat interface to interact with your created digital twins in real-time.
-   **🖼️ Image Processing**: Upload an image for your twin, which is processed by a serverless function to extract features.
-   **🧩 Pluggable Integrations**: A framework for adding clients (Discord, Slack, Twitter) and plugins (Web Search, Code Generation) to your agents.
-   **🚀 Modern Tech Stack**: Built with React, TypeScript, Vite, and a full Supabase backend (Auth, Database, Storage, Edge Functions).
-   **🎨 Sleek Dashboard**: A beautiful, responsive dashboard built with **shadcn/ui** and **Tailwind CSS**.

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Backend**: [Supabase](https://supabase.com/) (Database, Auth, Storage, Edge Functions)
-   **UI**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To get AgentForge running on your local machine, follow these instructions.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or higher)
-   A package manager: [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [bun](https://bun.sh/).
-   [Supabase Account](https://supabase.com/) for your backend.
-   [Supabase CLI](https://supabase.com/docs/guides/cli) installed on your machine.

### ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/agentforge.git
cd agentforge

# 2. Install frontend dependencies
npm install

# 3. Set up and run the Supabase backend
cd supabase
supabase start
cd ..

# 4. Create a .env file from the example and add your keys
cp .env.example .env

# 5. Run the frontend development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### 📦 Detailed Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/agentforge.git
    cd agentforge
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Supabase Backend**
    This project uses Supabase for its backend.
    -   Navigate to the `supabase` directory:
        ```bash
        cd supabase
        ```
    -   Start the local Supabase services. This will spin up a local Postgres database, Studio, and other services.
        ```bash
        supabase start
        ```
    -   The CLI will output your local Supabase URL and `anon` key. You will need these for the next step.
    -   **Important**: The `agent_secrets` table has a migration file, but other tables do not. You'll need to create the tables from the Supabase dashboard using the schemas found in `src/integrations/supabase/types.ts`.

4.  **Configure Environment Variables**
    Create a `.env` file in the project root by copying the example.
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Supabase credentials from the previous step.

    ```env
    # Get these from the `supabase start` command output
    VITE_SUPABASE_URL="http://127.0.0.1:54321"
    VITE_SUPABASE_ANON_KEY="your-local-supabase-anon-key"
    ```
    For deployed environments, use your production Supabase keys.

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will now be running on `http://localhost:8080`.

## 🖥️ Usage

-   **Sign Up / Login**: Create an account or sign in at `/auth`.
-   **Dashboard**: View your existing AI agents or create a new one.
-   **Create an Agent**: Click "Create New Twin" and follow the wizard to configure your agent's:
    -   Basic info (name, description, icon).
    -   Personality and knowledge base.
    -   Integrations and plugins.
    -   Securely stored secrets (API keys).
-   **Chat**: Navigate to an agent's page to start a conversation.

## 🏗️ Backend Architecture

The backend logic is handled by Supabase, including:

-   **Database**: Stores `digital_twins`, `users`, `conversations`, `messages`, and other related data.
-   **`agent_secrets` Table**: A secure table with Row Level Security (RLS) enabled to ensure that users can only access their own API keys. The schema is in `supabase/migrations/`.
-   **`process-twin-image` Edge Function**: A serverless function that can be triggered to perform backend processing on an agent's image, such as feature extraction or model generation.

## ✅ Testing

This project does not yet include an automated testing suite. This is a great opportunity for contributions! We recommend using [Vitest](https://vitest.dev/) for unit/integration tests and [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) for end-to-end tests.

To add testing, you can start by installing Vitest:
```bash
npm install -D vitest @testing-library/react
```
And adding a `test` script to `package.json`.

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a new Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

-   [Supabase](https://supabase.com/)
-   [shadcn/ui](https://ui.shadcn.com/)
-   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
-   [Vite](https://vitejs.dev/)
-   Initial scaffolding by [Lovable](https://lovable.dev/).
