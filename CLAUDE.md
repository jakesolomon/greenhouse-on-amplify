# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
# Start local development (frontend only)
npm run dev

# Start local development with network access (for testing on mobile devices)
npm run dev -- --host

# Start Amplify backend sandbox with streaming logs
npx ampx sandbox --stream-function-logs

# Full local development (run both commands in separate terminals)
npx ampx sandbox --stream-function-logs  # Terminal 1
npm run dev -- --host                     # Terminal 2
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once (CI)
npm run test:run
```

### Build & Lint
```bash
# Build for production (TypeScript compilation + Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build locally
npm preview
```

### Backend Deployment
```bash
# Deploy backend to AWS
npx ampx sandbox deploy

# Generate TypeScript types from GraphQL schema
npx ampx generate outputs
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Mantine 7 (components, hooks, forms)
- **Routing**: React Router 7 (client-side SPA)
- **Backend**: AWS Amplify Gen 2 (CDK-based infrastructure)
- **Database/API**: AWS AppSync (GraphQL with Lambda resolvers)
- **Auth**: AWS Cognito (email-based, simple login)
- **Storage**: AWS S3 (PDF storage for generated guides)
- **Payments**: Stripe (checkout sessions + webhooks)
- **AI**: OpenAI GPT-4o / GPT-4o-mini (structured outputs with Zod)
- **Email**: Amazon SES (order confirmations, contact form)

### Project Structure

#### Frontend (`src/`)
- **Dual Version System**: V1 and V2 pages coexist for A/B testing
  - `pages/` - Original UI/UX
  - `pages-v2/` - Redesigned versions with improved flows
  - All routes have `-v2` variants (e.g., `/planner` and `/planner-v2`)
- **State Management**: React Context + `localStorage` persistence (no Redux/Zustand)
  - Key state: `climateData`, `cropData`, `plantingSchedule`, `companionPlantingAdvice`
  - Dates stored in localStorage lose type info → manually reconstruct as `Date` objects on load
- **Web Worker**: `schedule-helpers.ts` runs planting conflict resolution in background thread
  - Prevents UI blocking during heavy computation
  - Uses `Worker(new URL(...))` for code splitting

#### Backend (`amplify/`)
- **16 Lambda Functions** (all TypeScript, 600s max timeout)
  - Crop data: `getTrueLeafSeedData`, `getCropDataFromTrueLeafDescription`
  - Climate: `getClimateData`
  - Planning: `getPlantingScheduleData`, `getCompanionPlants`, `getScheduleSummary`
  - LLM content: `getFullPlanIntroExtras`, `getFullPlanTasks`, `getFullPlanSummaries`
  - Commerce: `createCheckoutSession`, `handleStripePurchase`, `fulfillV2Guide`
  - Communication: `sendContactEmail`, `sendPrivySignup`
  - **DEPRECATED**: `getCropData`, `getFullPlanContent` (replaced by newer endpoints)

- **GraphQL API** (`data/resource.ts`)
  - All queries, no mutations or subscriptions
  - Authorization: Public API Key (30-day expiration) + Cognito/IAM fallbacks
  - Lambda function handlers for server-side logic

- **Authentication** (`auth/resource.ts`)
  - Simple email/password via Cognito User Pools
  - Unauthenticated identities enabled for public planner access

- **Storage**: S3 bucket `aws-growing-guide-plan-v1` for PDF uploads

### Key Workflows

#### Garden Plan Generation Pipeline
1. User inputs crops + ZIP code in `/planner` or `/planner-v2`
2. Frontend fetches climate data (`getClimateData` query)
3. Frontend fetches seed varieties from TrueLeaf API (`getTrueLeafSeedData`)
4. Frontend parses seed metadata (`getCropDataFromTrueLeafDescription`)
5. Web Worker calculates optimal planting schedule (conflict resolution)
6. Frontend requests companion planting advice (`getCompanionPlants` - LLM)
7. Frontend generates monthly task lists (`getFullPlanTasks` - LLM per crop)
8. Frontend generates monthly summaries (`getFullPlanSummaries` - LLM)
9. User proceeds to checkout or downloads guide

#### Purchase Flow
1. User clicks "Buy" → Frontend calls `createCheckoutSession`
2. Stripe Embedded Checkout iframe appears (`/checkout-v2`)
3. On payment success → Frontend calls `fulfillV2Guide` or `handleStripePurchase`
4. Lambda generates PDF server-side (React components → @react-pdf/renderer)
5. Lambda uploads PDF to S3 with conditional header (prevents duplicates)
6. Lambda sends order confirmation email via SES
7. User redirected to `/purchase-v2` with download link

#### LLM Integration Pattern
- All LLM functions use Zod for structured output validation
- OpenAI client initialized with API key from environment variables
- Cost optimization: `gpt-4o-mini` for deprecated endpoints, `gpt-4o` for production
- Error handling: Logs via AWS Lambda Powertools Logger

### Important Implementation Details

#### localStorage Keys
- `climateData` - Climate zone and temperature data
- `cropData` - Crop metadata from TrueLeaf Seed
- `plantingSchedule` - User's garden plan (Date objects require reconstruction)
- `userEmail` - Email opt-in tracking
- `purchaseSessionId` - Stripe session tracking
- `digitalGuidesRemainingV2` - License tracking (3 downloads per purchase)
- `printGuidesRemainingV2` - Print order count (1 per purchase)

#### Environment Variables (Lambda)
Set in Amplify backend function definitions:
- `OPENAI_API_KEY` - OpenAI API access
- `STRIPE_SECRET_KEY` - Stripe API (live mode)
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key

#### Stripe Configuration
- Live API Key: `pk_live_51QqzXAKXcuXgnQQo...` (in frontend code)
- Products: Print guides, digital guides (v1 & v2 variants)
- Promo codes: `WELCOME15` (automatic) or user-provided custom codes
- Checkout mode: Embedded (iframe-based UI)

#### API Deprecation Strategy
- Old endpoints remain functional to avoid breaking changes
- New clients should use replacement endpoints:
  - Replace `getCropData` with `getTrueLeafSeedData` + `getCropDataFromTrueLeafDescription`
  - Replace `getFullPlanContent` with `getFullPlanIntroExtras` + `getFullPlanTasks` + `getFullPlanSummaries`

#### Component Size Notes
- `plan-overview-v2.tsx` - 28KB (largest component, results visualization)
- `crop-types.ts` - 55KB (all selectable crop definitions)
- `schedule-helpers.ts` - 25KB (Web Worker for schedule calculation)

### Testing Locally

#### Mobile Device Testing
1. Run `npm run dev -- --host` to allow network connections
2. Vite will display local network URL (e.g., `http://192.168.1.x:5173`)
3. Access from mobile device on same network

#### Backend Testing
- Amplify sandbox mode provides isolated test environment
- Streaming logs (`--stream-function-logs`) show Lambda execution in real-time
- Use GraphQL queries from frontend to test function handlers

### Known Issues & Workarounds

#### Safari Gantt Chart Width
- Recent fix (commit: c02b5e2) - CSS selector adjusted for Safari compatibility
- Component: `gantt-chart.tsx`

#### Date Serialization in localStorage
- JavaScript Date objects → JSON strings lose type information
- Reconstruct as Date objects when reading from localStorage
- Affects: `plantingSchedule`, `climateData` (frost dates)

### External Integrations

#### TrueLeaf Seed Company API
- Endpoint: `/api/collectionSearch`
- Filters: In stock, Vegetable category, crop-specific parameters
- Returns: Product metadata (images, prices, descriptions)
- Used for seed variety recommendations and commerce links

#### Privy Email Service
- Endpoint: `sendPrivySignup` Lambda function
- Used in email opt-in modal (5-second delay after planner load)

#### Amazon SES
- Sender: jake@thegrowingguide.com
- BCC on order confirmations for admin tracking
- HTML-formatted emails with product mockup images

### Frontend Styling
- **Fonts**: Custom Merriweather font for headings (`fonts.css`)
- **Theme**: Mantine components with tailored theming
- **PostCSS**: Mantine preset + simple-vars plugin
- **Icons**: Tabler Icons React (`@tabler/icons-react`)

### TypeScript Configuration
- Strict mode enabled
- Separate configs: `tsconfig.app.json` (frontend), `tsconfig.node.json` (build tools)
- All Lambda functions use TypeScript with esbuild compilation

### Version Control Notes
- Main branch: `main` (no separate default branch)
- Recent commits focus on: V2 feature additions, Safari fixes, build error corrections
- Clean working directory at conversation start