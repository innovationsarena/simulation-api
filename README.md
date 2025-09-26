# GR Simulation Service API

## API Endpoints

| Enpoint                       | Method   | Async | Input              | Output                   | Description                                 |
| ----------------------------- | -------- | ----- | ------------------ | ------------------------ | ------------------------------------------- |
| /simulations                  | _POST_   | NO    | `SimulationInput`  | `Simulation`             | Creates new `Simulation`.                   |
| /simulations/:id              | _GET_    | NO    | -                  | `Simulation`             | Returns `Simulation`.                       |
| /simulations/:id              | _PATCH_  | NO    | `SimulationInput`  | `Simulation`             | Updates `Simulation`.                       |
| /simulations/:id/start        | _PATCH_  | YES   | -                  | `GenericMessageResponse` | Starts simulation.                          |
| /simulations/:id/stop         | _PATCH_  | YES   | -                  | `GenericMessageResponse` | Stops simulation.                           |
| /simulations/:id              | _DELETE_ | NO    | -                  | `GenericMessageResponse` | Starts simulation.                          |
| /simulations/:id/agents       | _GET_    | NO    | -                  | `Agent[]`                | List all agents in a simulation.            |
| /simulations/:id/interactions | _GET_    | NO    | -                  | `Interaction[]`          | List all interactions in a simulation.      |
| /simulations/:id/messages     | _GET_    | NO    | -                  | `Message[]`              | List all messages produced in a simulation. |
| /agents                       | _POST_   | NO    | `AgentInput`       | `Agent`                  | Creates new **Data derived** `Agent`.       |
| /agents/custom                | _POST_   | NO    | `CustomAgentInput` | `Agent`                  | Creates new **Custom** `Agent`.             |
| /agents/random                | _POST_   | NO    | `RandomAgentInput` | `Agent`                  | Creates new **Random** `Agent`.             |
| /agents/:id                   | _GET_    | NO    | -                  | `Agent`                  | Returns `Agent`.                            |
| /agents/:id                   | _PATCH_  | NO    | `AgentInput`       | `Agent`                  | Updates `Agent`.                            |
| /agents/:id                   | _DELETE_ | NO    | -                  | `GenericMessageResponse` | *DELETE*s `Agent`.                          |
| /agents/:id/messages          | _GET_    | NO    | -                  | `Message[]`              | List all messages produced by a agent.      |
| /agents/:id/evaluate          | _POST_   | YES   | `EvaluationInput`  | `Agent`                  | Evaluate agent.                             |
| /environments                 | _POST_   | NO    | `EnvironmentInput` | `Environment`            | Creates new `Environment`.                  |
| /environments/:id             | _GET_    | NO    | -                  | `Environment`            | Returns `Environment`.                      |
| /environments/:id             | _PATCH_  | NO    | `EnvironmentInput` | `Environment`            | Updates `Environment`.                      |
| /environments/:id             | _DELETE_ | NO    | `EnvironmentInput` | `Environment`            | *DELETE*s `Environment`.                    |
| /interactions                 | _POST_   | NO    | `InteractionInput` | `Interaction`            | Creates new `Interaction`, 'Discussion'     |
| /interactions/:id             | _GET_    | NO    | -                  | `Interaction`            | Returns `Interaction`.                      |
| /interactions/:id             | _PATCH_  | NO    | `InteractionInput` | `Interaction`            | Updates `Interaction`.                      |
| /interactions/:id             | _DELETE_ | NO    | -                  | `GenericMessageResponse` | *DELETE*s `Interaction`.                    |
| /interactions/:id/messages    | _GET_    | NO    | -                  | `Message[]`              | List all messages in a Interaction.         |

## Environmental variables

| name                       | example                                | description                      |
| -------------------------- | -------------------------------------- | -------------------------------- |
| PORT                       | 3000                                   | Serving port.                    |
| API_KEY                    | sup3rs3cr3tk3y                         | API key for calling the service. |
| API_URL                    | simulation.innovationsarenan.dev/api   | Public URL.                      |
| DEFAULT_LLM_PROVIDER       | openai                                 | AI provider for LLMs.            |
| DEFAULT_LLM_MODEL          | gpt-5-mini                             | Default LLM model.               |
| DEFAULT_LLM_TEMPERATURE    | 0.5                                    | Default temperature for LLM.     |
| DEFAULT_LLM_MESSAGE_TOKENS | 400                                    | max token in message.            |
| OPENAI_API_KEY             | sk-proj-7HjY3...                       | OpenAI API key.                  |
| SUPABASE_URL               | https://supabase.innovationsarenan.dev | Public url for Supabase.         |
| SUPABASE_KEY               | eyJ0eX...                              | Supabase service token.          |
| REDIS_HOST                 | redis://.....                          | Url/IP to Redis db incl auth.    |
| REDIS_PORT                 | 6379                                   | Port to Redis db.                |
| AGENTS_TABLE_NAME          | agents                                 | Name of agents table.            |
| ENVIRONMENTS_TABLE_NAME    | environments                           | Name of environments table.      |
| SIMULATIONS_TABLE_NAME     | simulations                            | Name of simulations table.       |
| MESSAGES_TABLE_NAME        | messages                               | Name of messages table.          |
| INTERACTIONS_TABLE_NAME    | interactions                           | Name of interactions table.      |
