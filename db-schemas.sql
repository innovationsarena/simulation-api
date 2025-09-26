-- Make sure uuid generator is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Simulations (created first so other tables can reference it)
CREATE TABLE public.simulations (
  id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  type text,
  name text NOT NULL,
  description text,
  topic text,
  stats jsonb,
  state text NOT NULL,
  environmentId text,
  CONSTRAINT simulations_pkey PRIMARY KEY (id)
);

-- 2) Environments (references simulations)
CREATE TABLE public.environments (
  id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  simulationId text,
  description text,
  objectives jsonb,
  constraints jsonb,
  values jsonb,
  CONSTRAINT environments_pkey PRIMARY KEY (id),
  CONSTRAINT environments_simulationId_fkey FOREIGN KEY (simulationId) REFERENCES public.simulations(id)
);

-- 3) Agents (references simulations)
CREATE TABLE public.agents (
  id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  version bigint NOT NULL,
  name text NOT NULL,
  simulationId text NOT NULL,
  state text NOT NULL,
  demographics jsonb,
  personality jsonb NOT NULL,
  objectives jsonb,
  dynamicProps jsonb,
  llmSettings jsonb NOT NULL,
  stats jsonb,
  inInteractionId text,
  evaluations jsonb,
  type text NOT NULL DEFAULT 'conversation',
  CONSTRAINT agents_pkey PRIMARY KEY (id),
  CONSTRAINT agents_simulationId_fkey FOREIGN KEY (simulationId) REFERENCES public.simulations(id)
);

-- 4) Interactions (participants as text array)
CREATE TABLE public.interactions (
  id text NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  simulationId text NOT NULL,
  participants text[] NOT NULL DEFAULT ARRAY[]::text[],
  summary text,
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_simulationId_fkey FOREIGN KEY (simulationId) REFERENCES public.simulations(id)
);

-- 6) Messages (reference agents, interactions, optional simulation)
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  interactionId text NOT NULL,
  senderId text NOT NULL,
  content text,
  simulationId text,
  tokens jsonb,
  interactionType text,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_senderId_fkey FOREIGN KEY (senderId) REFERENCES public.agents(id),
  CONSTRAINT messages_interactionId_fkey FOREIGN KEY (interactionId) REFERENCES public.interactions(id),
  CONSTRAINT messages_simulationId_fkey FOREIGN KEY (simulationId) REFERENCES public.simulations(id)
);

-- 7) Add the (previously omitted to avoid circular create order) FK from simulations -> environments
ALTER TABLE public.simulations
  ADD CONSTRAINT simulations_environmentId_fkey FOREIGN KEY (environmentId) REFERENCES public.environments(id);